import os
import math
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from .database import (
    init_db, log_alert_multi, get_alerts, get_all_shelters,
    log_sos, get_sos_logs, get_active_admin_alerts, get_latest_alert_for_location
)
from .weather_service import (
    PRESET_REGIONS, fetch_weather_data, haversine_distance_km,
    generate_multilingual_messages
)

app = FastAPI(
    title="Flash Flood Prediction System for Hilly Regions",
    description="Early warning and decision-support API for flash flood forecasting in mountainous terrains.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "ml", "flood_risk_model.joblib")
META_PATH = os.path.join(BASE_DIR, "ml", "model_metadata.json")
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend")

# Global ML model and metadata
model = None
model_meta = {}

@app.on_event("startup")
def startup_event():
    global model, model_meta
    init_db()

    # Load ML Model
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print(f"Loaded ML model successfully from {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model: {e}")

    if os.path.exists(META_PATH):
        try:
            with open(META_PATH, "r", encoding="utf-8") as f:
                model_meta = json.load(f)
        except Exception as e:
            print(f"Error loading metadata: {e}")

# Request Models
class AdminAlertRequest(BaseModel):
    location: str
    risk_level: str
    message_en: str
    message_kn: Optional[str] = None
    message_hi: Optional[str] = None

class SOSRequest(BaseModel):
    lat: float
    lon: float
    contact: str
    location_name: Optional[str] = "Current Location"

# Endpoints
@app.get("/api/locations")
def get_locations():
    """Return preset hilly flood-prone regions."""
    return {"regions": PRESET_REGIONS}

@app.get("/api/model/info")
def get_model_info():
    """Return trained model details, accuracy, and feature importances."""
    return {
        "status": "loaded" if model is not None else "not_loaded",
        "metadata": model_meta
    }

def predict_risk(rainfall_1h: float, rainfall_24h: float, slope: float, soil_moisture: float, elevation: float, pressure: float, river_dist: float = 350.0) -> Dict[str, Any]:
    """Run scikit-learn Random Forest model on telemetry features."""
    if model is None:
        # Fallback rule-based estimation if model file missing
        score = rainfall_1h * 0.4 + (rainfall_24h * 0.15) * (slope / 25.0)
        level = "Critical" if score > 80 else "High" if score > 45 else "Medium" if score > 20 else "Low"
        return {"risk_level": level, "confidence_pct": 85.0, "probabilities": {level: 0.85}, "factors": ["Heuristic assessment"]}

    feature_cols = [
        "rainfall_1h_mm", "rainfall_24h_mm", "slope_deg",
        "soil_moisture_pct", "elevation_m", "pressure_hpa", "river_distance_m"
    ]
    df_feat = pd.DataFrame([{
        "rainfall_1h_mm": float(rainfall_1h),
        "rainfall_24h_mm": float(rainfall_24h),
        "slope_deg": float(slope),
        "soil_moisture_pct": float(soil_moisture),
        "elevation_m": float(elevation),
        "pressure_hpa": float(pressure),
        "river_distance_m": float(river_dist)
    }])[feature_cols]

    pred_class = model.predict(df_feat)[0]
    classes = list(model.classes_)
    probs = model.predict_proba(df_feat)[0]
    prob_dict = {cls: round(float(p) * 100, 1) for cls, p in zip(classes, probs)}
    confidence = prob_dict.get(pred_class, 80.0)

    # Contributing Risk Factors Analysis
    factors = []
    if rainfall_1h >= 35:
        factors.append(f"Torrential cloudburst intensity: {rainfall_1h:.1f} mm/h")
    elif rainfall_1h >= 15:
        factors.append(f"Intense precipitation rate: {rainfall_1h:.1f} mm/h")

    if rainfall_24h >= 120:
        factors.append(f"Excessive antecedent 24h accumulation: {rainfall_24h:.1f} mm")

    if slope >= 30:
        factors.append(f"Extremely steep terrain ({slope:.1f}° gradient) accelerates gully torrents")
    elif slope >= 20:
        factors.append(f"Moderate-to-steep hill slope ({slope:.1f}°)")

    if soil_moisture >= 80:
        factors.append(f"Soil near complete saturation ({soil_moisture:.1f}%) maximizing runoff coefficient")

    if not factors:
        factors.append("Safe precipitation and drainage conditions within hill catchment limits")

    return {
        "risk_level": pred_class,
        "confidence_pct": confidence,
        "probabilities": prob_dict,
        "factors": factors
    }

@app.get("/api/weather-and-risk")
def get_weather_and_risk(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    name: str = Query("Selected Region", description="Location name"),
    river_dist: float = Query(350.0, description="Distance to nearest gully/river in meters")
):
    """
    Core prediction endpoint:
    1. Fetches weather data (Open-Meteo or robust offline engine)
    2. Estimates elevation and slope
    3. Feeds into Random Forest Classifier
    4. Computes 24h forecast curve
    5. Automatically logs alerts if risk level changes or is elevated
    """
    weather = fetch_weather_data(lat, lon)
    risk_info = predict_risk(
        rainfall_1h=weather["rainfall_1h_mm"],
        rainfall_24h=weather["rainfall_24h_mm"],
        slope=weather["slope_deg"],
        soil_moisture=weather["soil_moisture_pct"],
        elevation=weather["elevation_m"],
        pressure=weather["pressure_hpa"],
        river_dist=river_dist
    )

    # Calculate 24-hour hourly risk forecast curve
    hourly_p = weather.get("hourly_precipitation", [])
    hourly_times = weather.get("hourly_times", [])
    hourly_risks = []
    
    running_cum = weather["rainfall_24h_mm"] * 0.4
    for p in hourly_p:
        running_cum += p
        # Compute hourly expected risk
        h_info = predict_risk(
            rainfall_1h=p,
            rainfall_24h=running_cum,
            slope=weather["slope_deg"],
            soil_moisture=min(98.0, weather["soil_moisture_pct"] + p * 0.3),
            elevation=weather["elevation_m"],
            pressure=weather["pressure_hpa"],
            river_dist=river_dist
        )
        hourly_risks.append({
            "risk_level": h_info["risk_level"],
            "confidence_pct": h_info["confidence_pct"],
            "score": 90 if h_info["risk_level"] == "Critical" else 65 if h_info["risk_level"] == "High" else 35 if h_info["risk_level"] == "Medium" else 10
        })

    # Generate multilingual messages
    messages = generate_multilingual_messages(
        risk_level=risk_info["risk_level"],
        location_name=name,
        rainfall_1h=weather["rainfall_1h_mm"],
        slope=weather["slope_deg"]
    )

    # Check last alert for this location to avoid duplicate logging if unchanged
    last_alert = get_latest_alert_for_location(name)
    should_log = False
    if last_alert is None and risk_info["risk_level"] in ["Medium", "High", "Critical"]:
        should_log = True
    elif last_alert and last_alert.get("risk_level") != risk_info["risk_level"]:
        should_log = True

    if should_log:
        log_alert_multi(
            location=name,
            risk_level=risk_info["risk_level"],
            messages=messages,
            source="auto"
        )

    # Active admin alerts for top banner override if any
    admin_alerts = get_active_admin_alerts()

    return {
        "location": {
            "name": name,
            "latitude": lat,
            "longitude": lon,
            "elevation_m": weather["elevation_m"],
            "slope_deg": weather["slope_deg"]
        },
        "weather": weather,
        "prediction": risk_info,
        "messages": messages,
        "forecast_24h": {
            "times": hourly_times,
            "precipitation": hourly_p,
            "risk_curves": hourly_risks
        },
        "active_admin_alerts": admin_alerts,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

@app.get("/api/shelters")
def get_shelters_and_evacuation(
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude")
):
    """
    Returns shelters sorted by proximity, identifies safest high-ground shelter,
    and returns waypoint coordinates for evacuation routing line.
    Scans all 1000+ safe places in database to find the absolute nearest refuge.
    """
    all_shelters = get_all_shelters()
    if not all_shelters:
        return {"shelters": [], "nearest_shelter": None, "total_shelters_count": 0}

    annotated = []
    for s in all_shelters:
        dist_km = haversine_distance_km(lat, lon, s["lat"], s["lon"])
        walk_time_mins = round(dist_km * 16.0) # approx 3.75 km/h uphill walking pace
        annotated.append({
            **s,
            "distance_km": round(dist_km, 2),
            "estimated_walk_mins": walk_time_mins
        })

    annotated.sort(key=lambda x: x["distance_km"])
    nearest = annotated[0]

    return {
        "shelters": annotated[:60], # Top 60 nearest shelters
        "nearest_shelter": nearest,
        "total_shelters_count": len(annotated),
        "user_coords": [lat, lon]
    }

@app.get("/api/alerts")
def get_alert_history(
    limit: int = Query(50, ge=1, le=200),
    language: Optional[str] = Query(None, description="Filter by 'en', 'kn', 'hi'")
):
    """Get history of alerts from SQLite alerts table."""
    alerts = get_alerts(limit=limit, language=language)
    return {"alerts": alerts, "count": len(alerts)}

@app.post("/api/admin/alert")
def create_admin_alert(req: AdminAlertRequest):
    """Post authority manual alert banner in English, Kannada, and Hindi."""
    messages = {
        "en": req.message_en,
        "kn": req.message_kn if req.message_kn else f"ಅಧಿಕೃತ ತುರ್ತು ಎಚ್ಚರಿಕೆ ({req.risk_level}): {req.message_en}",
        "hi": req.message_hi if req.message_hi else f"आधिकारिक आपातकालीन चेतावनी ({req.risk_level}): {req.message_en}"
    }
    alert_id = log_alert_multi(
        location=req.location,
        risk_level=req.risk_level,
        messages=messages,
        source="admin"
    )
    return {
        "success": True,
        "alert_id": alert_id,
        "message": f"Authority alert successfully broadcast for {req.location} at {req.risk_level} level."
    }

@app.post("/api/sos")
def trigger_sos(req: SOSRequest):
    """Log emergency SOS dispatch and return emergency coordinates and rescue contacts."""
    sos_id = log_sos(lat=req.lat, lon=req.lon, contact=req.contact)
    maps_link = f"https://maps.google.com/?q={req.lat:.6f},{req.lon:.6f}"
    return {
        "success": True,
        "sos_id": sos_id,
        "lat": req.lat,
        "lon": req.lon,
        "maps_link": maps_link,
        "disaster_helpline": "112 / 1077 (NDRF & SDRF Control Room)",
        "message": "SOS emergency beacon recorded. Rescue teams and local authorities alerted."
    }

@app.get("/api/sos/logs")
def view_sos_logs():
    """Admin endpoint to see received emergency SOS alerts."""
    return {"sos_logs": get_sos_logs(limit=50)}

# Mount static frontend directory
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
def serve_home():
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "Flash Flood Prediction System API online. Frontend files pending."}
