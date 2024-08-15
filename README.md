Multi-Container Application Overview
Introduction
This multi-container application is designed to comprehensively collect, process, forecast, and visualize data related to the cryptocurrency project "runes." The architecture employs multiple Docker containers, each fulfilling a specific role within the system. The application is designed to be modular, scalable, and efficient, allowing for real-time data handling, forecasting, and user interaction through a React-based frontend dashboard.

Containers Overview
1. Rune API (rune_api)
Role: Collects data from the Genidata.io APIs and stores it in PostgreSQL and MongoDB databases.
Functionality:
Fetches data related to various runes, such as price_sats, volume_1d_btc, and holders.
Processes and stores this data in PostgreSQL for structured querying and MongoDB for more flexible document storage.
Runs continuously, ensuring the latest data is always available for analysis and forecasting.
2. Discord API (discord_api)
Role: Collects Discord channel chat conversations and stores them in the database for cross-referencing and domain knowledge validation.
Functionality:
Scrapes conversations from specified Discord channels.
Sends the collected data to MongoDB and PostgreSQL for analysis and storage.
Helps ensure that the forecasting models are based on comprehensive, relevant data by cross-checking rune-related discussions in the community.
3. Flask Forecasting API (flask_api_forecasting)
Role: Processes rune data, builds and trains machine learning models, and provides forecasting services.
Functionality:
Pulls rune data from databases and preprocesses it using various data science methods, such as normalization, null value handling, and sequence generation.
Utilizes an LSTM neural network model to forecast rune values for different timeframes (4-hour, 24-hour).
Stores the forecasted data in MongoDB and serves it over an API for visualization in the frontend.
Supports on-demand forecasting for any rune specified by the user, including data preprocessing and running the pretrained model to generate forecasts.
4. Node API Server (node_api_server)
Role: Handles the retrieval and serving of extensive time series data to the React frontend.
Functionality:
Provides historical data, including price_sats, volume_1d_btc, and holders for each rune.
Serves forecasted predictions and logs from various modules.
Integrates with Redis for caching to optimize data retrieval speeds, ensuring that the React frontend receives data quickly and efficiently.
5. React App (react_app)
Role: Provides a user interface for monitoring system performance, viewing forecasts, historical data, and logs.
Functionality:
Displays real-time system health indicators for each API, showing whether the backend services are running optimally.
Plots forecast values and historical data using interactive charts.
Allows users to enter any rune name to generate a forecast, with real-time status updates and progress bars to ensure users are informed throughout the forecasting process.
Provides access to detailed logs, Discord chat summaries, and health checks for each service.
6. Training Model Module (training_model_module)
Role: Facilitates regular retraining of machine learning models.
Functionality:
Allows users to initiate model retraining based on changing market conditions.
Displays real-time training progress, including epoch performance, and updates the dashboard with the latest model performance metrics.
Ensures that the LSTM model remains up-to-date with the latest data trends, improving forecasting accuracy.
7. CAdvisor (cadvisor)
Role: Monitors Docker containers' performance and system statistics.
Functionality:
Provides real-time monitoring of all Docker containers.
Plots key system metrics such as CPU usage, memory usage, and network I/O, enabling users to track the health and performance of each service.
8. Grafana and Prometheus
Role: Provides real-time monitoring and metric collection for the entire application.
Functionality:
Integrates with the system to offer real-time dashboard metrics for each container and service.
Allows users to visualize and analyze system performance, providing insights into resource usage and service health.
9. Redis (redis)
Role: Acts as a caching layer for the node_api_server.
Functionality:
Caches time series data retrieved from MongoDB, enabling faster data retrieval for the frontend.
Refreshes cached data every hour, ensuring that the most up-to-date information is always served.
10. Flask Mongo API (flask_mongo_api)
Role: Serves rune predictions and data directly from MongoDB.
Functionality:
Provides an API endpoint for accessing rune predictions and historical data.
Integrates with the React dashboard to deliver real-time data visualization.
Real-Time Monitoring and Status Updates
A key feature of this application is its real-time monitoring and status update capabilities. Each service in the ecosystem has a /health endpoint that provides a real-time status check. This health check is displayed on the React dashboard using indicators:

Green Light: Indicates the service is running optimally.
Red Light: Indicates the service is facing issues or is down.
In addition to health checks, the application provides real-time status updates throughout the forecasting and model training processes. Users are kept informed about each step via status messages and progress bars, ensuring transparency and reliability in the application's operations.

How It Works
Data Collection:

The rune_api collects rune data from Genidata.io and stores it in both PostgreSQL and MongoDB for structured and flexible querying.
The discord_api gathers relevant Discord conversations, storing them for analysis and cross-referencing with rune data.
Forecasting:

The flask_api_forecasting module processes rune data and runs it through a pre-trained LSTM model.
The module generates forecasts every 5 minutes for specific runes and serves these predictions through APIs.
Data Serving:

The node_api_server handles the retrieval and caching of extensive time series data for quick access in the React frontend.
The flask_mongo_api provides access to prediction data directly from MongoDB.
User Interaction:

The React frontend displays real-time health indicators, forecast data, historical values, logs, and Discord summaries.
Users can initiate forecasts, monitor the training process, and interact with the system in real time.
Monitoring:

CAdvisor, Grafana, and Prometheus provide comprehensive monitoring, enabling users to visualize and analyze system performance in real time.
Deployment Instructions
Build and Start Services:

sh
Copy code
docker-compose up --build
Verify Service Health:

Access the React app at http://your_server_ip:3000 to verify system health and functionality.
Use the real-time indicators to ensure all backend services are functioning correctly and are accessible from the frontend.
Monitor the System:

Utilize CAdvisor, Grafana, and Prometheus to track container performance and system metrics.
Use the real-time monitoring tools integrated into the React dashboard to keep the system running smoothly.
Conclusion
This multi-container application provides a robust, scalable platform for collecting, processing, forecasting, and visualizing data related to the "runes" cryptocurrency project. It ensures efficient data handling, accurate predictions, and real-time interaction through a well-designed React frontend. The system's real-time monitoring and status updates provide transparency and reliability, making it a powerful tool for data analysis and decision-making in the rapidly evolving cryptocurrency landscape.



![image](https://github.com/user-attachments/assets/29c6fc92-3d8c-42c9-9871-5db3e7f6e71b)

![image](https://github.com/user-attachments/assets/92091859-586c-4cc5-91a2-5d6313b8475d)
