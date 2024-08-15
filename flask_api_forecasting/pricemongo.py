from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS
CORS(app)
# MongoDB connection
client = MongoClient('')
db = client['runes']
collection = db['GinidataRunes']

@app.route('/get-data', methods=['GET'])
def get_data():
    filter = {
        'rune_name': 'BILLION•DOLLAR•CAT'
    }
    project = {
        'price_sats': 1, 
        'timestamp': 1
    }
    sort = list({
        'timestamp': -1
    }.items())

    result = collection.find(
        filter=filter,
        projection=project,
        sort=sort
    )

    data = list(result)
    for item in data:
        item['_id'] = str(item['_id'])  # Convert ObjectId to string for JSON serialization

    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
