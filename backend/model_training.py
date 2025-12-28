import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import os

# --- Update this path as needed ---
DATA_FOLDER = 'data'
os.makedirs(DATA_FOLDER, exist_ok=True)

# Use the combined dataset with all cities
combined_file = os.path.join(DATA_FOLDER, 'combined_traffic_all_cities.csv')

if os.path.exists(combined_file):
    df = pd.read_csv(combined_file)
    print(f"Loaded combined dataset with {len(df)} records")
else:
    print("Combined dataset not found! Please run generate_city_datasets.py first")
    exit(1)

# Check that necessary columns exist
required_columns = {'City', 'Hour', 'Weekday', 'Junction', 'Temperature', 'TrafficFlow'}
assert required_columns.issubset(df.columns), "Missing required columns in data!"

# Encode city names to numeric values
city_encoder = LabelEncoder()
df['CityEncoded'] = city_encoder.fit_transform(df['City'])

# Features and target
X = df[['Hour', 'Weekday', 'Junction', 'Temperature', 'CityEncoded']]
y = df['TrafficFlow']

# Fit scaler and model
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
model = RandomForestRegressor()
model.fit(X_scaled, y)

# Save model, scaler, and city encoder
joblib.dump(model, os.path.join(DATA_FOLDER, 'traffic_rf.pkl'))
joblib.dump(scaler, os.path.join(DATA_FOLDER, 'scaler.pkl'))
joblib.dump(city_encoder, os.path.join(DATA_FOLDER, 'city_encoder.pkl'))
print("Model, scaler, and city encoder saved!")
print(f"Cities: {list(city_encoder.classes_)}")
