from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import joblib

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DATA_FOLDER = os.path.join(os.path.dirname(__file__), 'data')
MODEL_PATH = os.path.join(DATA_FOLDER, 'traffic_rf.pkl')
SCALER_PATH = os.path.join(DATA_FOLDER, 'scaler.pkl')
CITY_ENCODER_PATH = os.path.join(DATA_FOLDER, 'city_encoder.pkl')

# Load model, scaler, and city encoder with error handling
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    city_encoder = joblib.load(CITY_ENCODER_PATH)
except Exception as e:
    print("Error loading model, scaler, or city encoder:", e)
    model, scaler, city_encoder = None, None, None

# City-junction mapping
cities = ['Kalaburagi', 'Bangalore', 'Bidar', 'Raichur']
junctions = {
    1: 'main_street',
    2: 'highway_cross',
    3: 'city_center',
    4: 'airport_road'
}

# Load all city-junction datasets
city_junction_data = {}
for city in cities:
    for junction_id, junction_name in junctions.items():
        key = f"{city}_{junction_id}"
        filename = f"{city.lower()}_{junction_name}_traffic.csv"
        filepath = os.path.join(DATA_FOLDER, filename)
        if os.path.exists(filepath):
            city_junction_data[key] = pd.read_csv(filepath)
        else:
            print(f"Warning: {filename} not found")

@app.route('/predict', methods=['POST'])
def predict_traffic():
    if model is None or scaler is None or city_encoder is None:
        return jsonify({'error': 'Model, scaler, or city encoder not loaded. Check server logs.'}), 500

    body = request.get_json()
    hour = int(body.get('hour', 8))
    weekday = int(body.get('weekday', 2))
    junction = int(body.get('junction', 1))
    temperature = float(body.get('temperature', 25))
    city = body.get('city', 'Bangalore')
    
    # Encode city name
    try:
        city_encoded = city_encoder.transform([city])[0]
    except:
        city_encoded = 0  # Default to first city if unknown
    
    input_arr = np.array([[hour, weekday, junction, temperature, city_encoded]])
    scaled_input = scaler.transform(input_arr)
    predicted = float(model.predict(scaled_input)[0])
    
    # Get actual traffic from city-specific dataset
    dataset_key = f"{city}_{junction}"
    actual = None
    if dataset_key in city_junction_data:
        df = city_junction_data[dataset_key]
        actual_df = df[(df['Hour'] == hour) & (df['Weekday'] == weekday)]
        actual = float(actual_df['TrafficFlow'].values[0]) if not actual_df.empty else None
    
    return jsonify({
        "predicted_traffic": round(predicted, 2),
        "actual_traffic": round(actual, 2) if actual is not None else None,
        "city": city
    })

@app.route('/api/traffic', methods=['GET'])
def get_traffic():
    city = request.args.get('city', 'Bangalore')
    junction = request.args.get('junction', '1')
    dataset_key = f"{city}_{junction}"
    
    if dataset_key in city_junction_data:
        data = city_junction_data[dataset_key]
        return jsonify(data.head(50).to_dict(orient='records'))
    else:
        return jsonify({'error': f'No data found for {city} - Junction {junction}'}), 404

@app.route('/api/cities', methods=['GET'])
def get_cities():
    return jsonify({'cities': cities})

@app.route('/')
def index():
    return jsonify({
        'status': 'running',
        'message': 'Traffic Flow Prediction API',
        'endpoints': {
            '/predict': 'POST - Make traffic predictions',
            '/api/traffic': 'GET - Get historical traffic data',
            '/api/cities': 'GET - Get list of cities'
        }
    })

@app.route('/favicon.ico')
def favicon():
    return '', 204  # No content response

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚦 Traffic Flow Prediction Backend Server")
    print("="*50)
    print(f"Server running at: http://127.0.0.1:5000")
    print(f"API Endpoints:")
    print(f"  - POST /predict       (Make predictions)")
    print(f"  - GET  /api/traffic   (Get traffic data)")
    print(f"  - GET  /api/cities    (Get city list)")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
