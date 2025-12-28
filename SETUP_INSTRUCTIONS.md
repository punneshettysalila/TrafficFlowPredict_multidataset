# Traffic Flow Prediction - City-Based System Setup

## Overview
This system now supports multiple cities (Kalaburagi, Bangalore, Bidar, Raichur) with different traffic patterns for each city and junction.

## Setup Steps

### 1. Generate City-Based Datasets
Navigate to the backend folder and run the dataset generation script:

```bash
cd backend
python generate_city_datasets.py
```

This will create:
- Individual CSV files for each city-junction combination (e.g., `kalaburagi_main_street_traffic.csv`)
- A combined dataset `combined_traffic_all_cities.csv` with all cities and junctions
- Total of 16 CSV files (4 cities × 4 junctions)

### 2. Train the Model
After generating datasets, train the model with city support:

```bash
python model_training.py
```

This will:
- Load the combined dataset with all cities
- Encode city names as numeric features
- Train a RandomForest model with city as an additional feature
- Save three files: `traffic_rf.pkl`, `scaler.pkl`, and `city_encoder.pkl`

### 3. Start the Backend Server
Run the Flask backend server:

```bash
python app.py
```

The server will:
- Load all city-junction datasets
- Expose APIs for prediction and traffic data
- Run on `http://127.0.0.1:5000`

### 4. Open the Frontend
Open `frontend/index.html` in your web browser.

The frontend includes:
- City selector dropdown with 4 cities
- Junction selection (1-4)
- Real-time predictions using the trained model
- Fallback to local predictions if backend is unavailable

## City Configurations

Each city has different traffic characteristics:

- **Kalaburagi**: Base traffic ~80, moderate variation
- **Bangalore**: Base traffic ~150, high variation (metro city)
- **Bidar**: Base traffic ~60, low variation
- **Raichur**: Base traffic ~70, moderate variation

## Junctions

1. Main Street
2. Highway Cross
3. City Center
4. Airport Road

## Features

- City-based traffic predictions
- Multi-junction support
- Temperature-based adjustments
- Peak hour patterns (7-10 AM, 5-8 PM)
- Weekend traffic variations
- Real-time API integration with fallback mode

## API Endpoints

### POST /predict
Predicts traffic flow for given parameters
```json
{
  "hour": 8,
  "weekday": 2,
  "junction": 1,
  "temperature": 25,
  "city": "Bangalore"
}
```

### GET /api/traffic
Get historical traffic data
```
?city=Bangalore&junction=1
```

### GET /api/cities
Get list of available cities

## Troubleshooting

- If backend fails, frontend will use local predictions
- Ensure all dependencies are installed: `pandas`, `numpy`, `scikit-learn`, `flask`, `joblib`
- Check that all CSV files are generated before training the model
- Verify the backend server is running before making predictions

## Next Steps

- Add CORS support for cross-origin requests
- Implement real-time data updates
- Add more cities and junctions
- Integrate with actual traffic APIs
