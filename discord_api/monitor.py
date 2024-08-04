import requests
import psycopg2
from psycopg2 import sql
import time
import json
from dotenv import load_dotenv
import os
from flask import Flask, jsonify
from flask_cors import CORS
from threading import Thread

load_dotenv()  # take environment variables from .env.
AUTH_TOKEN = os.getenv('AUTH_TOKEN')

# Database connection details
conn_details = "dbname='sandbox' user='postgres' host='' password=''"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
headers = {
}

# Including all cookies as provided
cookies = {
    
}

# List of channels to check
channels = [
    
]

status = {
    "running": True,
    "last_checked": time.time()
}

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

def insert_new_messages(messages, channel_id, nickname, conn):
    """Inserts new messages into the PostgreSQL database."""
    with conn.cursor() as cur:
        for message in messages:
            cur.execute(sql.SQL("SELECT 1 FROM discord_messages WHERE message_id = %s"), (message["id"],))
            if cur.fetchone() is None:
                # Handling message and author details
                content = message.get("content", None)
                timestamp = message.get("timestamp")
                author = message.get("author", {})
                author_id = author.get("id")
                author_username = author.get("username")
                author_global_name = author.get("global_name", None)

                # Handling referenced messages
                ref_msg = message.get("referenced_message", None)
                ref_msg_id = ref_msg.get("id") if ref_msg else None
                ref_msg_content = ref_msg.get("content") if ref_msg else None
                ref_author = ref_msg.get("author", {}) if ref_msg else {}
                ref_msg_username = ref_author.get("username", None)
                ref_msg_global_name = ref_author.get("global_name", None)

                # Handling attachments
                attachments = message.get("attachments", [])
                attachment_file_name = attachments[0].get("filename") if attachments else None
                attachment_url = attachments[0].get("url") if attachments else None

                # Insert the data into the database
                cur.execute(sql.SQL("""
                    INSERT INTO discord_messages (
                        message_id, channel_id, nickname, content, author_id, author_username,
                        author_global_name, timestamp, referenced_message_id, referenced_message_content,
                        referenced_message_username, referenced_message_global_name, attachment_file_name, attachment_url
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """), (
                    message["id"], channel_id, nickname, content, author_id, author_username,
                    author_global_name, timestamp, ref_msg_id, ref_msg_content,
                    ref_msg_username, ref_msg_global_name, attachment_file_name, attachment_url
                ))
        conn.commit()

def setup_database():
    """Ensures the necessary table exists in the database."""
    with psycopg2.connect(conn_details) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS discord_messages (
                    message_id VARCHAR(50) PRIMARY KEY,
                    channel_id VARCHAR(50),
                    nickname VARCHAR(100),
                    content TEXT,
                    author_id VARCHAR(50),
                    author_username VARCHAR(100),
                    author_global_name VARCHAR(100),
                    timestamp TIMESTAMP,
                    referenced_message_id VARCHAR(50),
                    referenced_message_content TEXT,
                    referenced_message_username VARCHAR(100),
                    referenced_message_global_name VARCHAR(100),
                    attachment_file_name VARCHAR(255),
                    attachment_url TEXT
                )
            """)
            conn.commit()

def main():
    """Main function to handle fetching and storing Discord messages."""
    setup_database()
    with psycopg2.connect(conn_details) as conn:
        while True:
            for channel in channels:
                print(f"Processing channel: {channel['nickname']} (ID: {channel['id']})")
                messages = fetch_discord_messages(channel["id"])
                if messages:
                    print(f"Fetched {len(messages)} messages for channel: {channel['nickname']}")
                    insert_new_messages(messages, channel["id"], channel["nickname"], conn)
                else:
                    print(f"No new messages or failed to fetch messages for channel: {channel['nickname']}")
                time.sleep(1.2)  # Respectful delay between requests
            print("Completed one loop through all channels. Restarting...")
            status["last_checked"] = time.time()

@app.route('/status', methods=['GET'])
def get_status():
    current_status = {
        "status": "ACTIVE" if status["running"] else "INACTIVE",
        "time": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(status["last_checked"]))
    }
    return jsonify(current_status)

if __name__ == "__main__":
    # Run Flask server in a separate thread
    flask_thread = Thread(target=app.run, kwargs={'host': '0.0.0.0', 'port': 5550})
    flask_thread.start()
    main()
