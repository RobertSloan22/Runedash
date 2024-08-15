from pymongo import MongoClient
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

# MongoDB connection string
MONGO_URI = ""

# Hard-coded database and collection names
DB_NAME = "runes"
COLLECTION_NAME = "GinidataRunes"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes and from any origin

@app.route("/")
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico')



@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route('/api5/histforecast', methods=['GET'])
def get_predictions():
    try:
        limit = int(request.args.get('limit', 10000))
        offset = int(request.args.get('offset', 0))

        # Fetch documents with the rune_name "BILLION DOLLAR CAT" and limit the fields to rune_name and price_sats
        query = {"rune_name": "BILLION DOLLAR CAT"}
        projection = {"_id": 0, "rune_name": 1, "price_sats": 1}
        runes_data = list(collection.find(query, projection).sort('timestamp', -1).skip(offset).limit(limit))

        return jsonify(runes_data)
    except Exception as e:
        return f"Error fetching data: {str(e)}", 500

if __name__ == "__main__":
    app.run(port=4770, host='0.0.0.0')
