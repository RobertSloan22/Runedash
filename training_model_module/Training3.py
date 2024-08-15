import re
import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from sqlalchemy import create_engine
import logging
from flask import Flask, jsonify, request, send_from_directory
from flask_socketio import SocketIO, emit
from threading import Thread, Lock
import os
from tensorflow.keras.callbacks import Callback
from flask_cors import CORS
import docker

# Initialize the Flask app
app = Flask(__name__, static_folder="static")
# Enable CORS
# Enable CORS and allow localhost
CORS(app, origins="*")
socketio = SocketIO(app)
# Set up logging
logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s:%(levelname)s:%(message)s",
)

# Database connection details


# Create the SQLAlchemy engine
engine = create_engine(
    f"postgresql+psycopg2://{db_params['user']}:{db_params['password']}@{db_params['host']}/{db_params['dbname']}"
)

# Ensure the static directory exists
if not os.path.exists("static"):
    os.makedirs("static")

# Columns to fetch from the database
columns_to_fetch = ["price_sats"]

# Global variable to store forecasting results and a lock for thread safety
forecasting_results = None
results_lock = Lock()
training_thread = None
training_lock = Lock()

# Global variables to store training metrics
training_metrics = {
    'epochs': [],
    'loss': [],
    'val_loss': []
}

def get_data():
    try:
        query = f"SELECT {', '.join(columns_to_fetch)}, timestamp FROM runes_token_info_genii WHERE rune_name = 'BILLION•DOLLAR•CAT' ORDER BY timestamp DESC LIMIT 200"
        df = pd.read_sql_query(query, engine)
        logging.info("Data fetched successfully")
        return df
    except Exception as e:
        logging.error(f"Error retrieving data: {e}")
        return None

def preprocess_data(df):
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df.sort_values("timestamp", inplace=True)
    df.set_index("timestamp", inplace=True)

    df = df.rename(columns={"price_sats": "Close"})
    df["Open"] = df["Close"]
    df["High"] = df["Close"]
    df["Low"] = df["Close"]
    df["Adj Close"] = df["Close"]
    df["Volume"] = 1

    df.ffill(inplace=True)
    return df[["Open", "High", "Low", "Close", "Adj Close", "Volume"]]

def create_sequences(data, sequence_length=30, forecast_horizon=24):
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data["Close"].values.reshape(-1, 1))

    X, y = [], []
    for i in range(sequence_length, len(scaled_data) - forecast_horizon):
        X.append(scaled_data[i - sequence_length : i, 0])
        y.append(scaled_data[i : i + forecast_horizon, 0])

    X, y = np.array(X), np.array(y)
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))
    return X, y, scaler

class MetricsLogger(Callback):
    def on_epoch_begin(self, epoch, logs=None):
        socketio.emit(
            'epoch_start',
            {
                'epoch': epoch + 1
            }
        )

    def on_train_batch_end(self, batch, logs=None):
        socketio.emit(
            'batch_metrics',
            {
                'batch': batch + 1,
                'loss': logs.get('loss'),
                'step_time': f"{logs.get('batch_time', 0):.3f}ms"
            }
        )

    def on_epoch_end(self, epoch, logs=None):
        if logs is not None:
            # Emit detailed epoch metrics to the frontend
            socketio.emit(
                'epoch_metrics',
                {
                    'epoch': epoch + 1,
                    'loss': logs.get('loss'),
                    'val_loss': logs.get('val_loss')
                }
            )
            # Store metrics in the global variable
            training_metrics['epochs'].append(epoch + 1)
            training_metrics['loss'].append(logs.get('loss'))
            training_metrics['val_loss'].append(logs.get('val_loss'))

def build_model(input_shape, forecast_horizon=24):
    from tensorflow.keras.models import Model
    from tensorflow.keras.layers import Input, LSTM, Dense, Multiply, AdditiveAttention, Permute, Reshape, Flatten, Attention
    
    inputs = Input(shape=input_shape)
    x = LSTM(units=50, return_sequences=True)(inputs)
    x = LSTM(units=50, return_sequences=True)(x)

    attention = AdditiveAttention(name="attention_weight")
    permuted = Permute((2, 1))(x)
    reshaped = Reshape((-1, input_shape[0]))(permuted) 
    attention_result = attention([reshaped, reshaped])
    multiplied = Multiply()([reshaped, attention_result])
    permuted_back = Permute((2, 1))(multiplied)
    reshaped_back = Reshape((-1, 50))(permuted_back)

    flattened = Flatten()(reshaped_back)
    outputs = Dense(forecast_horizon)(flattened)  # Adjust the output layer for 24-hour predictions

    model = Model(inputs=inputs, outputs=outputs)
    model.compile(optimizer="adam", loss="mean_squared_error")
    return model

def train_model():
    global training_metrics
    # Reset training metrics
    training_metrics = {
        'epochs': [],
        'loss': [],
        'val_loss': []
    }

    df = get_data()
    if df is None:
        logging.error("No data fetched, returning None.")
        return
    data = preprocess_data(df)
    X, y, scaler = create_sequences(data)

    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    model = build_model((X_train.shape[1], 1))

    history = model.fit(
        X_train, y_train, epochs=200, batch_size=25, validation_split=0.2,
        callbacks=[MetricsLogger()]
    )
    model.save("modeldash.h5")

    with open("history.npy", "wb") as f:
        np.save(f, history.history["loss"])
        np.save(f, history.history["val_loss"])

    test_loss = model.evaluate(X_test)
    logging.info(f"Test Loss: {test_loss}")

    y_pred = model.predict(X_test)
    logging.info("Predictions made successfully")

    # Ensure the index is a datetime index
    df.index = pd.to_datetime(df.index)

    socketio.emit(
        "future_predictions",
        {
            "dates": df.index[-len(y_test) :].strftime("%Y-%m-%d %H:%M:%S").tolist(),
            "predictions": y_pred.tolist(),
            "actuals": y_test.tolist(),
        },
    )

def start_training():
    global training_thread
    with training_lock:
        if training_thread is None or not training_thread.is_alive():
            training_thread = Thread(target=train_model)
            training_thread.start()
            return True
        else:
            return False

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route('/status', methods=['GET'])
def check_status():
    client = docker.from_env()
    container_name = "training_model_module"  # Replace with your container name

    try:
        container = client.containers.get(container_name)
        if container.status == 'running':
            return jsonify({"status": "running"}), 200
        else:
            return jsonify({"status": "not running"}), 503
    except docker.errors.NotFound:
        return jsonify({"status": "not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/start_training", methods=["POST"])
def start_training_route():
    if start_training():
        return jsonify({"status": "Training started"}), 200
    else:
        return jsonify({"status": "Training already in progress"}), 409

@app.route("/latest_metrics", methods=["GET"])
def latest_metrics():
    global training_metrics
    with results_lock:
        return jsonify(training_metrics), 200

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@socketio.on("connect")
def handle_connect(auth=None):
    logging.info("Client connected")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5100, debug=True, allow_unsafe_werkzeug=True)
