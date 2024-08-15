from pymongo import MongoClient
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os



# MongoDB connection string
MONGO_URI = "mongodb+srv://radevai1201:szZ2HmXFRc902EeW@cluster0.b8z5ks7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico')

@app.route('/api5/histforecast', methods=['GET'])
def get_predictions():
    try:
        limit = int(request.args.get('limit', 10000))
        offset = int(request.args.get('offset', 0))

        # Fetch the most recent documents from the collection with pagination
        runes_data = list(collection.find().sort('timestamp', -1).skip(offset).limit(limit))

        # Convert MongoDB BSON data to JSON
        for rune in runes_data:
            rune.pop('_id', None)  # Remove MongoDB ObjectId

        return jsonify(runes_data)
    except Exception as e:
        return f"Error fetching data: {str(e)}", 500

if __name__ == "__main__":
    app.run(port=4660, host='0.0.0.0')
