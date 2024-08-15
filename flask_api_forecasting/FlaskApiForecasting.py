from flask import Flask, request, jsonify
from forecasting_service import ForecastingService
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route("/api3/predict", methods=["POST"])
def predict():
    data = request.json
    rune_name = data.get("rune_name")
    if not rune_name:
        return jsonify({"error": "Missing rune_name"}), 400

    forecasting_service = ForecastingService()  # Assuming this is your class name
    prediction, scaler = forecasting_service.load_model_and_predict(rune_name)
    if prediction is None:
        return jsonify({"error": "No prediction could be made"}), 500

    response_data = {
        "prediction": prediction.tolist(), 
    }
    return jsonify(response_data), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5080, debug=True)  