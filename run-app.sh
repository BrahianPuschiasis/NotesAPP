#!/bin/bash

# Script to run the Java/Spring Boot and React + Vite application

# Function to run the Java/Spring Boot application
start_backend() {
  echo "Setting up and running the backend..."
  cd backend 
  ./mvnw clean install
  java -jar target/ensolvers-0.0.1-SNAPSHOT.jar &
}

# Function to run the React + Vite application
start_frontend() {
  echo "Setting up and waiting for the backend to finish..."
  cd frontend/ensolversWeb  
  npm install
  echo "Running the frontend..."
  npm run dev
}

# Main function
run_app() {
  start_backend &  # Run in the background
  wait  # Wait for the backend to finish before continuing
  start_frontend
}

# Execute the main function
run_app
