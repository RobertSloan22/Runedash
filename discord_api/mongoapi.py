
import requests
import json
from dotenv import load_dotenv
import os
import time
from pymongo import MongoClient


load_dotenv()  # Take environment variables from .env
AUTH_TOKEN = os.getenv('AUTH_TOKEN')


    # Include other headers as you have specified in your original code

headers = {
    
}

# Including all cookies as provided
cookies = {
   
}

# List of channels to check
channels = [
  
]
# List of channels to check, assuming the list 'channels' is defined as in your original code.
# Connection to MongoDB
#client = MongoClient('')
client = MongoClient('')
db = client['']
collection = db['']

def fetch_discord_messages(channel_id):
    """Fetches messages from a specified Discord channel using Discord API."""
    url = f"https://discord.com/api/v9/channels/{channel_id}/messages?limit=50"
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch messages for channel {channel_id}: HTTP {response.status_code} - {response.text}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Request exception for channel {channel_id}: {e}")
        return []

def save_messages_to_mongodb(messages, channel_id):
    """Saves messages to MongoDB."""
    try:
        if messages:
            result = collection.insert_many(messages)  # Inserting messages as documents
            print(f"Inserted {len(result.inserted_ids)} messages into MongoDB for channel ID: {channel_id}")
        else:
            print("No messages to save.")
    except Exception as e:
        print(f"Error saving messages to MongoDB for channel ID: {channel_id}: {e}")

def main():
    """Main function to handle fetching and storing Discord messages."""
    while True:
        for channel in channels:
            print(f"Processing channel: {channel['nickname']} (ID: {channel['id']})")
            messages = fetch_discord_messages(channel["id"])
            if messages:
                print(f"Fetched {len(messages)} messages for channel: {channel['nickname']}")
                save_messages_to_mongodb(messages, channel["id"])
            else:
                print(f"No new messages or failed to fetch messages for channel: {channel['nickname']}")
            time.sleep(1.9)  # Respectful delay between requests
        print("Completed one loop through all channels. Restarting...")

if __name__ == "__main__":
    main()
