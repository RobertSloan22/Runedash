# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to /app
COPY . /app

# Make ports 5080, 5600, 3055, and 4650 available to the world outside this container
EXPOSE 5080 5600 3055 4650 4660 4770

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run the application
CMD sh -c "python FlaskApiForecasting.py & python forecasting_service.py & python ForecastingServiceServer.py & python MongoApi.py & python HistForecast.py & python CatHistory.py"
