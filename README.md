# HydroShield: Flash Flood Prediction System for Hilly Regions
> **Phase 1 Mini Project** | AI Early Warning, Multi-Language Alerts & Evacuation Decision Support

HydroShield is an intelligent flash flood warning and disaster decision-support system specifically designed for mountainous and hilly terrains (e.g., Western Ghats - Kodagu, Wayanad, Chikkamagaluru; and Himalayan ranges).

---

## 🌟 Key Features

1. **Terrain-Aware Flash Flood ML Prediction**:
   - Random Forest Classifier trained on 1,600 hilly hydrological events.
   - Evaluates: Hourly Rainfall, 24h Cumulative Rain, Slope Gradient (°), Elevation, Soil Saturation (%), Atmospheric Pressure.
   - 4-Tier Risk Categorization: **Low**, **Medium**, **High**, **Critical** (Accuracy: **91.88%**).

2. **Interactive Topographical Map (Leaflet)**:
   - Dynamic catchment risk radius around user/preset locations.
   - Pre-mapped high-ground safe shelters with capacity, contact, and elevation.
   - Click anywhere on the map to inspect terrain & predict flood risk for that exact hill slope!

3. **Safe Shelter & Evacuation Route Finder**:
   - Computes distance and estimated uphill walking time.
   - Draws interactive highlighted evacuation route polyline to the nearest safe shelter.

4. **24-Hour Rainfall & Risk Forecast Curve (Chart.js)**:
   - Dual-axis chart visualizing hourly rainfall (mm) and predicted flood risk index.

5. **Multi-Language Alert System**:
   - Seamless instant switching between **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिंदी)**.

6. **Distress Emergency SOS Transmitter**:
   - Real-time GPS coordinate acquisition (`navigator.geolocation`).
   - One-click WhatsApp emergency message generator with direct Google Maps rescue link.
   - Synthesizer siren alarm (Web Audio API) for auditory alert.
   - Direct emergency helpline quick-dials (112, 1077).

7. **Mobile Application & Android APK Ready**:
   - Modern iOS / Android smartphone application shell with bottom navigation bar (⚡ Overview, 🗺️ Risk Map, 🛡️ Shelters, 📈 24h Forecast, ⚙️ Alerts & Admin).
   - Progressive Web App (PWA) installable on any Android or iPhone via "Add to Home Screen".
   - Packaged with `capacitor.config.json` and [mobile_packaging/ANDROID_APK_GUIDE.md](file:///c:/Users/Preetham%20N%20Gowda/Desktop/Min_J/mobile_packaging/ANDROID_APK_GUIDE.md) to generate `.apk` files via PWABuilder or Capacitor CLI.
   - High-resolution glassmorphic app icon badge.

8. **Authority Admin Broadcast Panel**:
   - Disaster management authorities can broadcast priority overrides across regional devices.

9. **SQLite Database Layer**:
   - Structured relational schema (`alerts`, `shelters`, `sos_logs`).
   - Prepared for seamless Phase 2 migration to **Cloudflare D1**.

---

## 🚀 Quickstart Guide

### 1. Requirements
- Python 3.10+
- Installed packages: `fastapi`, `uvicorn`, `scikit-learn`, `pandas`, `numpy`, `requests`, `joblib`

### 2. Run the Application
Open a terminal in the project directory and run:

```bash
python run.py
```

This single command will:
1. Verify / train the Random Forest ML model (`backend/ml/flood_risk_model.joblib`).
2. Initialize and seed the SQLite database (`backend/flash_flood.db`).
3. Launch the FastAPI server at `http://127.0.0.1:8000`.

### 3. Open in Browser
Open your browser and navigate to:
```
http://localhost:8000
```

---

## 📁 Project Architecture

```
Min_J/
├── backend/
│   ├── data/
│   │   ├── historical_flood_data.csv   # 1600 hilly hydrological records
│   │   └── shelters.json              # High-ground relief shelters catalog
│   ├── ml/
│   │   ├── train_model.py             # Random Forest training script
│   │   ├── flood_risk_model.joblib    # Persisted scikit-learn model
│   │   └── model_metadata.json        # Accuracy, metrics & feature importance
│   ├── database.py                    # SQLite schema (alerts, shelters, sos_logs)
│   ├── weather_service.py             # Open-Meteo API & terrain slope calculations
│   └── main.py                        # FastAPI endpoints and static routing
├── frontend/
│   ├── index.html                     # HTML5 single-page application shell
│   ├── style.css                      # Glassmorphic responsive dark theme
│   └── app.js                         # React 18, Leaflet, Chart.js & Web Audio siren
├── report/
│   └── PROJECT_REPORT.md              # Technical project report & ML evaluation
├── run.py                             # One-click startup script
└── README.md
```

---

## 📡 REST API Summary

- `GET /api/locations` - List vulnerable preset hilly regions.
- `GET /api/weather-and-risk?lat={lat}&lon={lon}&name={name}` - Fetch live weather, calculate terrain slope/elevation, and execute Random Forest prediction.
- `GET /api/shelters?lat={lat}&lon={lon}` - Find nearest safe shelters and compute evacuation route.
- `GET /api/alerts?limit=50&language=en` - Retrieve alerts history.
- `POST /api/admin/alert` - Authority manual alert broadcast.
- `POST /api/sos` - Log emergency distress signal with live coordinates.
- `GET /api/model/info` - Get model accuracy (91.88%), confusion matrix, and feature importances.
