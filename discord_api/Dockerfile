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

# Make port 5550 available to the world outside this container
EXPOSE 5550

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run the application
CMD sh -c "python monitor.py & python mongoapi.py & python postgresapi.py"
