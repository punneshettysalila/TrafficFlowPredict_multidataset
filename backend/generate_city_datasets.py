import pandas as pd
import numpy as np
import os

# Create data folder if it doesn't exist
DATA_FOLDER = 'data'
os.makedirs(DATA_FOLDER, exist_ok=True)

# City configurations with different traffic patterns
cities = {
    'Kalaburagi': {'base_traffic': 80, 'variation': 30, 'peak_multiplier': 1.3},
    'Bangalore': {'base_traffic': 150, 'variation': 50, 'peak_multiplier': 1.8},
    'Bidar': {'base_traffic': 60, 'variation': 20, 'peak_multiplier': 1.2},
    'Raichur': {'base_traffic': 70, 'variation': 25, 'peak_multiplier': 1.25}
}

# Junction configurations
junctions = {
    1: 'main_street',
    2: 'highway_cross',
    3: 'city_center',
    4: 'airport_road'
}

def generate_city_junction_data(city_name, city_config, junction_id):
    """Generate traffic data for a specific city and junction"""
    np.random.seed(hash(city_name + str(junction_id)) % (2**32))
    
    data = []
    base = city_config['base_traffic']
    var = city_config['variation']
    peak_mult = city_config['peak_multiplier']
    
    # Generate data for each hour (0-23) and weekday (0-6)
    for weekday in range(7):
        for hour in range(24):
            # Peak hours: 7-10 AM and 5-8 PM
            if hour in [7, 8, 9, 10, 17, 18, 19, 20]:
                traffic = base * peak_mult + np.random.randint(-var, var)
            # Low traffic: midnight to 5 AM
            elif hour < 6:
                traffic = base * 0.3 + np.random.randint(-var//2, var//2)
            # Normal traffic
            else:
                traffic = base + np.random.randint(-var, var)
            
            # Weekend adjustment (slightly lower traffic)
            if weekday in [5, 6]:
                traffic *= 0.85
            
            # Temperature effect (realistic for Indian cities)
            temp = 20 + np.random.rand() * 15 + (hour / 24) * 10
            
            # Junction-specific multiplier
            junction_mult = 1.0 + (junction_id - 2.5) * 0.1
            traffic *= junction_mult
            
            data.append({
                'City': city_name,
                'Hour': hour,
                'Weekday': weekday,
                'Junction': junction_id,
                'Temperature': round(temp, 2),
                'TrafficFlow': max(10, int(traffic))
            })
    
    return pd.DataFrame(data)

# Generate datasets for all cities and junctions
all_data = []
for city_name, city_config in cities.items():
    for junction_id, junction_name in junctions.items():
        df = generate_city_junction_data(city_name, city_config, junction_id)
        all_data.append(df)
        
        # Save individual junction files per city
        filename = f"{city_name.lower()}_{junction_name}_traffic.csv"
        filepath = os.path.join(DATA_FOLDER, filename)
        df.to_csv(filepath, index=False)
        print(f"Created: {filename} with {len(df)} records")

# Combine all data for training
combined_df = pd.concat(all_data, ignore_index=True)
combined_df.to_csv(os.path.join(DATA_FOLDER, 'combined_traffic_all_cities.csv'), index=False)
print(f"\nCreated combined dataset with {len(combined_df)} records")
print(f"Cities: {list(cities.keys())}")
print(f"Junctions: {list(junctions.values())}")
