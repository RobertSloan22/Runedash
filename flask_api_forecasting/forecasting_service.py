import logging
import threading
import uuid
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import os

# Initialize Flask app
app = Flask(__name__, static_folder="static")
CORS(app)

# Connect to MongoDB
client = MongoClient(
    "mongodb+srv://radevai1201:szZ2HmXFRc902EeW@cluster0.b8z5ks7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
db = client["runes"]
job_status = {}

class ForecastingService:
    def __init__(self):
        self.model = None

    def get_data(self, rune_name):
        job_status[job_id]['message'] = "Fetching data..."
        filter = {"rune_name": rune_name}
        project = {
            "rune_name": 1,
            "price_sats": 1,
            "timestamp": 1,
            "volume_1d_btc": 1,
        }
        result = client["runes"]["GinidataRunes"].find(
            filter=filter, projection=project
        ).sort("timestamp", -1).limit(100)
        df = pd.DataFrame(list(result))
        df = df.sort_values("timestamp")
        return df

    def preprocess_data(self, df):
        job_status[job_id]['message'] = "Processing data..."
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
        df.sort_values("timestamp", inplace=True)
        df["timestamp"] = df["timestamp"].dt.strftime("%Y-%m-%d %H:%M:%S")
        df.set_index("timestamp", inplace=True)
        df = df.rename(columns={"price_sats": "Close"})
        df["Open"] = df["Close"]
        df["High"] = df["Close"]
        df["Low"] = df["Close"]
        df["Adj Close"] = df["Close"]
        df["Volume"] = 1
        df.ffill(inplace=True)
        return df[["Open", "High", "Low", "Close", "Adj Close", "Volume"]]

    def create_sequences(self, data, sequence_length=30):
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data["Close"].values.reshape(-1, 1))
        X = []
        for i in range(sequence_length, len(scaled_data)):
            X.append(scaled_data[i - sequence_length : i, 0])
        X = np.array(X)
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))
        return X, scaler

    def load_model(self):
        job_status[job_id]['message'] = "Loading the model..."
        model = load_model(
            "modelsats5.h5", custom_objects={"mse": MeanSquaredError()}
        )
        return model

    def load_model_and_predict(self, rune_name):
        global job_id
        df = self.get_data(rune_name)
        if df is None or df.empty:
            return None

        data = self.preprocess_data(df)
        X, scaler = self.create_sequences(data)

        job_status[job_id]['message'] = "Forecasting on data..."
        if self.model is None:
            self.model = self.load_model()

        predictions = self.model.predict(X)
        predictions = predictions.reshape(predictions.shape[0], -1)
        predictions = scaler.inverse_transform(predictions)

        predictions_list = [{"date": date, "prediction": float(pred[0])} for date, pred in zip(df.index[-len(predictions):], predictions)]
        print(predictions_list)  # Add this line for debugging

        job_status[job_id]['message'] = "Finishing predictions..."
        return predictions_list

def forecast_job(rune_name, job_id):
    service = ForecastingService()
    predictions = service.load_model_and_predict(rune_name)
    if predictions is None:
        job_status[job_id] = {"status": "error", "error": "Error during forecasting"}
    else:
        job_status[job_id] = {"status": "completed", "data": predictions}
    print(f"Job {job_id} status: {job_status[job_id]}")  # Add this line for debugging

@app.route("/")
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico')

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route("/api4/forecast", methods=["POST"])
def forecast():
    global job_id
    rune_name = request.json.get("rune_name")
    if not rune_name:
        return jsonify({"error": "rune_name is required"}), 400

    job_id = str(uuid.uuid4())
    job_status[job_id] = {"status": "in_progress", "message": "Job started..."}
    threading.Thread(target=forecast_job, args=(rune_name, job_id)).start()

    return jsonify({"job_id": job_id}), 200

@app.route("/api4/forecast_status/<job_id>", methods=["GET"])
def forecast_status(job_id):
    status = job_status.get(job_id)
    if not status:
        return jsonify({"error": "Invalid job ID"}), 404
    print(status)  # Add this line for debugging
    return jsonify(status)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5600)
