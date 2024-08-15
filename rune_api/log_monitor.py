import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from flask import Flask, jsonify
from flask_cors import CORS
import threading
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)

log_file_path = 'app.log'
status = {
    "running": True,
    "last_checked": time.time()
}

class LogFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == log_file_path:
            logging.info(f"Log file {log_file_path} modified.")
            with open(log_file_path, 'rb') as log_file:
                log_file.seek(-2, 2)  # Move the cursor to the second last byte.
                while log_file.read(1) != b'\n':  # Move the cursor to the start of the last line.
                    log_file.seek(-2, 1)
                last_line = log_file.readline().decode()
                logging.info(f"Last line read from log file: {last_line}")
                if '- INFO - Query Status: 2 Batch  saved to database' in last_line:
                    status["status"] = "ACTIVE"
                    status["time"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    status["logs"].append(last_line)
                    logging.info(f"Status updated to ACTIVE at {status['time']}")
            status["last_checked"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            logging.info(f"Last checked time updated to {status['last_checked']}")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route('/status', methods=['GET'])
def get_status():
    status["last_checked"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    logging.info(f"Status endpoint called. Returning status: {status}")
    return jsonify(status)

def start_observer():
    event_handler = LogFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    observer_thread = threading.Thread(target=start_observer)
    observer_thread.daemon = True
    observer_thread.start()
    app.run(host='0.0.0.0', port=5540)