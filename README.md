# Traffic Flow Prediction - Multi-City Multi-Dataset System

An advanced traffic flow prediction system supporting multiple cities across Karnataka with AI-powered predictions.

## Features

- 🏙️ **Multi-City Support**: Kalaburagi, Bangalore, Bidar, Raichur
- 🚦 **4 Junctions per City**: Main Street, Highway Cross, City Center, Airport Road
- 🤖 **AI-Powered Predictions**: Random Forest ML model with city-based learning
- 📊 **Real-Time Visualization**: Interactive charts with Chart.js
- 🌡️ **Weather Integration**: Temperature-based traffic predictions
- 📈 **Advanced Analytics**: Accuracy metrics, peak hour analysis, historical data

## Quick Start

### Option 1: Automated Setup (Recommended)

1. Run the setup script:
```bash
setup.bat
```

2. Start the backend server:
```bash
start_backend.bat
```

3. Open `frontend/index.html` in your browser

### Option 2: Manual Setup

1. **Install Dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Generate City Datasets**:
```bash
python generate_city_datasets.py
```

3. **Train the Model**:
```bash
python model_training.py
```

4. **Start Backend Server**:
```bash
python app.py
```

5. **Open Frontend**: Open `frontend/index.html` in your browser

## Project Structure

```
traffic-flow-prediction-multi-dataset/
├── backend/
│   ├── app.py                        # Flask API server
│   ├── model_training.py             # ML model training script
│   ├── generate_city_datasets.py     # Dataset generation script
│   ├── requirements.txt              # Python dependencies
│   └── data/                         # Generated datasets and models
├── frontend/
│   ├── index.html                    # Main UI
│   ├── main.css                      # Styling
│   └── scripts/
│       ├── advanced-app.js           # Main application logic
│       └── weather.js                # Weather integration
├── setup.bat                         # Automated setup script
├── start_backend.bat                 # Backend startup script
├── SETUP_INSTRUCTIONS.md             # Detailed setup guide
└── README.md                         # This file
```

## City Configurations

Each city has unique traffic patterns:

| City | Base Traffic | Variation | Peak Multiplier |
|------|--------------|-----------|-----------------|
| **Kalaburagi** | 80 | ±30 | 1.3× |
| **Bangalore** | 150 | ±50 | 1.8× |
| **Bidar** | 60 | ±20 | 1.2× |
| **Raichur** | 70 | ±25 | 1.25× |

## API Endpoints

### POST /predict
Predict traffic flow for specific parameters:
```json
{
  "hour": 8,
  "weekday": 2,
  "junction": 1,
  "temperature": 25,
  "city": "Bangalore"
}
```

### GET /api/traffic?city={city}&junction={id}
Get historical traffic data for a city-junction combination

### GET /api/cities
Get list of available cities

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, Chart.js
- **Backend**: Python, Flask, Flask-CORS
- **ML**: scikit-learn (Random Forest), pandas, numpy
- **Data**: Custom-generated realistic traffic datasets

## Features in Detail

### City Selection
- Choose from 4 cities in Karnataka
- Each city has unique traffic patterns based on population and infrastructure

### Junction Analysis
- 4 junctions per city with different characteristics
- Real-time and historical data comparison

### Machine Learning
- Random Forest Regressor for accurate predictions
- Features: Hour, Weekday, Junction, Temperature, City
- Trained on synthetic data matching real traffic patterns

### Visualization
- Interactive charts with zoom and pan
- Export charts as PNG or PDF
- Download analysis reports and CSV data

## Development Team

**Developed by Megha and Team**
Final Year Information Science Engineering
PDA College © 2025

## License

This project is developed for educational purposes.

## Troubleshooting

- **Backend won't start**: Ensure Python 3.7+ is installed and dependencies are installed via `pip install -r requirements.txt`
- **Model not found**: Run `python generate_city_datasets.py` followed by `python model_training.py`
- **CORS errors**: Make sure Flask-CORS is installed (`pip install flask-cors`)
- **Frontend not connecting**: Verify backend is running on `http://127.0.0.1:5000`

For detailed setup instructions, see [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
