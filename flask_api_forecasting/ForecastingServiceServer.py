import os
import logging
from threading import Lock, Thread
from pymongo import MongoClient
import pandas as pd
from sqlalchemy import create_engine
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import time
from datetime import datetime
from flask import Flask, jsonify, send_file
import matplotlib.pyplot as plt
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



# Ensure the static directory exists
if not os.path.exists("static"):
    os.makedirs("static")

# Columns to fetch from the database
columns_to_fetch = ["price_sats"]

# Global variable to store forecasting results and a lock for thread safety
results_lock = Lock()

# Connect to MongoDB
client = MongoClient(
    ""
)
db = client["runes"]
logs_collection = db["logs"]
forecast_collection = db["forecast"]

# Connect to PostgreSQL
db_params = {
    "dbname": "sandbox",
    "user": "postgres",
    "host": "",
    "password": "",
}
engine = create_engine(
    f"postgresql+psycopg2://{db_params['user']}:{db_params['password']}@{db_params['host']}/{db_params['dbname']}"
)

class MongoHandler(logging.Handler):
    def __init__(self, collection):
        logging.Handler.__init__(self)
        self.collection = collection

    def emit(self, record):
        log_entry = self.format(record)
        self.collection.insert_one({"log": log_entry})

# Add MongoHandler to the logging configuration
mongo_handler = MongoHandler(logs_collection)
logging.basicConfig(handlers=[mongo_handler], level=logging.INFO)

class ForecastingService:
    def __init__(self):
        self.model = self.load_model()

    @staticmethod
    def get_data():
        try:
            query = f"SELECT {', '.join(columns_to_fetch)}, timestamp FROM runes_token_info_genii WHERE rune_name = 'BILLION•DOLLAR•CAT' ORDER BY timestamp DESC LIMIT 100"
            df = pd.read_sql_query(query, engine)
            logging.info("Data fetched successfully")
            return df
        except Exception as e:
            logging.error(f"Error retrieving data: {e}")
            return None

    @staticmethod
    def preprocess_data(df):
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

    @staticmethod
    def create_sequences(data, sequence_length=30):
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data["Close"].values.reshape(-1, 1))
        X = []
        for i in range(sequence_length, len(scaled_data)):
            X.append(scaled_data[i - sequence_length: i, 0])
        X = np.array(X)
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))
        return X, scaler

    @staticmethod
    def load_model():
        try:
            model = load_model("modelsats5.h5", custom_objects={"mse": MeanSquaredError()})
            logging.info("Model loaded successfully.")
            return model
        except Exception as e:
            logging.error(f"Error loading model: {e}")
            return None

    def load_model_and_predict(self):
        df = self.get_data()
        if df is None:
            logging.error("No data fetched, returning None.")
            return None, None

        data = self.preprocess_data(df)
        X, scaler = self.create_sequences(data)

        try:
            predictions = self.model.predict(X)
            predictions = predictions.reshape(predictions.shape[0], -1)
            predictions = scaler.inverse_transform(predictions)
            logging.info("Predictions made successfully.")
        except Exception as e:
            logging.error(f"Error during prediction: {e}")
            return None, None

        return predictions, df.index[-len(predictions):]

    @staticmethod
    def save_forecast_to_mongo(forecast_data):
        try:
            forecast_collection.insert_one(forecast_data)
            logging.info("Forecast data saved to MongoDB successfully")
        except Exception as e:
            logging.error(f"Error saving forecast data to MongoDB: {e}")

    @staticmethod
    def save_forecast_to_postgres(forecast_data):
        try:
            forecast_df = pd.DataFrame(forecast_data)
            if "_id" in forecast_df:
                forecast_df.drop(columns=["_id"], inplace=True)
            forecast_df.to_sql("forecasts", engine, if_exists="append", index=False)
            logging.info("Forecast data saved to PostgreSQL successfully")
        except Exception as e:
            logging.error(f"Error saving forecast data to PostgreSQL: {e}")

    def forecast_job(self):
        while True:
            predictions, dates = self.load_model_and_predict()
            if predictions is not None:
                with results_lock:
                    # Prepare forecast data for saving
                    forecast_data = {
                        "dates": list(dates),
                        "predictions": predictions.tolist(),
                    }
                    self.save_forecast_to_mongo(forecast_data)
                    self.save_forecast_to_postgres(forecast_data)
                    
                    # Update the global status_info dictionary
                    status_info["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    status_info["status"] = "Running good"
                    status_info["dates"] = list(dates)
                    status_info["predictions"] = predictions.tolist()
                
                logging.info("Forecasting completed and results updated.")
            else:
                logging.error("Error during forecasting.")
            
            time.sleep(60)  # Run a new forecast every minute

# Global variable to store status
status_info = {
    "timestamp": None,
    "status": "Not started"
}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route("/api4/forecastingstatus", methods=["GET"])
def training_status():
    return jsonify(status_info)

@app.route("/api4/forecastplot", methods=["GET"])
def forecast_plot():
    with results_lock:
        if "predictions" in status_info and "dates" in status_info:
            dates = status_info["dates"]
            predictions = status_info["predictions"]

            plt.figure(figsize=(10, 5))
            plt.plot(dates, predictions, label="Predicted Prices")
            plt.xlabel("Date")
            plt.xticks(rotation=90)

            plt.ylabel("Price (sats)")
            plt.title("Forecast Plot")
            plt.legend()
            plt.grid(True)

            # Save plot to a bytes buffer
            buf = io.BytesIO()
            plt.savefig(buf, format="png")
            buf.seek(0)
            plt.close()

            return send_file(buf, mimetype="image/png")

        return "No forecast data available", 404

if __name__ == "__main__":
    service = ForecastingService()
    forecast_thread = Thread(target=service.forecast_job)
    forecast_thread.start()

    app.run(host="0.0.0.0", port=3055)  # Bind to 0.0.0.0 to expose the service outside the container
