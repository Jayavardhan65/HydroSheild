import math
import requests
from typing import Dict, Any, List, Tuple, Optional

# Preset Hilly Regions vulnerable to flash floods
PRESET_REGIONS = [
    {
        "id": "kodagu",
        "name": "Madikeri / Kodagu",
        "state": "Karnataka",
        "lat": 12.4244,
        "lon": 75.7382,
        "base_elevation": 1150,
        "base_slope": 29.5,
        "river": "Cauvery / Lakshmanathirtha Basin",
        "desc": "Western Ghats hilly catchment prone to monsoon torrents and slope runoff."
    },
    {
        "id": "wayanad",
        "name": "Wayanad / Meppadi",
        "state": "Kerala",
        "lat": 11.5512,
        "lon": 76.1287,
        "base_elevation": 980,
        "base_slope": 35.0,
        "river": "Chaliyar / Iruvanjippuzha Catchment",
        "desc": "High-slope tea estate hills prone to rapid cloudburst torrents."
    },
    {
        "id": "chikkamagaluru",
        "name": "Chikkamagaluru / Baba Budan",
        "state": "Karnataka",
        "lat": 13.3912,
        "lon": 75.7231,
        "base_elevation": 1080,
        "base_slope": 26.5,
        "river": "Bhadra / Tunga Tributaries",
        "desc": "Steep coffee estate hills with rapid surface drainage."
    },
    {
        "id": "agumbe",
        "name": "Agumbe (Shimoga)",
        "state": "Karnataka",
        "lat": 13.5042,
        "lon": 75.0934,
        "base_elevation": 645,
        "base_slope": 31.0,
        "river": "Sita River Gorge",
        "desc": "Highest rainfall zone in Western Ghats, steep escarpment."
    },
    {
        "id": "munnar",
        "name": "Munnar Hills",
        "state": "Kerala",
        "lat": 10.0889,
        "lon": 77.0595,
        "base_elevation": 1530,
        "base_slope": 34.0,
        "river": "Muthirapuzha River",
        "desc": "Confluence of 3 mountain streams with steep tea slopes."
    },
    {
        "id": "shimla",
        "name": "Shimla Hills",
        "state": "Himachal Pradesh",
        "lat": 31.1048,
        "lon": 77.1734,
        "base_elevation": 2200,
        "base_slope": 38.0,
        "river": "Sutlej / Giri River Valleys",
        "desc": "Himalayan steep ridge with intense cloudburst sensitivity."
    },
    {
        "id": "darjeeling",
        "name": "Darjeeling",
        "state": "West Bengal",
        "lat": 27.0410,
        "lon": 88.2663,
        "base_elevation": 2040,
        "base_slope": 36.5,
        "river": "Teesta / Rangeet Catchment",
        "desc": "Eastern Himalayan steep topography with rapid runoff."
    }
]

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_elevation_and_slope(lat: float, lon: float) -> Tuple[float, float]:
    """
    Query Open-Meteo Elevation API for central point and offset points to calculate slope degree.
    Falls back to preset approximations if API is unreachable.
    """
    try:
        # Sample center and offset points (~500m apart) to compute gradient
        delta = 0.005 # ~550m
        url = f"https://api.open-meteo.com/v1/elevation?latitude={lat},{lat+delta},{lat}&longitude={lon},{lon},{lon+delta}"
        resp = requests.get(url, timeout=3.5)
        if resp.status_code == 200:
            elevs = resp.json().get("elevation", [])
            if len(elevs) >= 3:
                e_center = elevs[0]
                e_north = elevs[1]
                e_east = elevs[2]

                dist_m = delta * 111000 # approx meters per degree
                diff_n = abs(e_north - e_center)
                diff_e = abs(e_east - e_center)
                max_diff = max(diff_n, diff_e)
                
                # Slope in degrees = arctan(rise / run)
                slope_deg = math.degrees(math.atan2(max_diff, dist_m))
                # Add natural micro-topography baseline for hilly terrain
                slope_deg = max(8.0, min(50.0, slope_deg * 2.5 + 12.0))
                return round(e_center, 1), round(slope_deg, 1)
    except Exception:
        pass

    # Fallback to closest preset or heuristic
    closest_region = min(PRESET_REGIONS, key=lambda r: haversine_distance_km(lat, lon, r["lat"], r["lon"]))
    dist = haversine_distance_km(lat, lon, closest_region["lat"], closest_region["lon"])
    if dist < 45:
        return float(closest_region["base_elevation"]), float(closest_region["base_slope"])

    # Generic hilly heuristic
    return 950.0, 24.5

def get_openweathermap_data(lat: float, lon: float, api_key: str) -> Optional[Dict[str, Any]]:
    """
    Fetch live weather telemetry from OpenWeatherMap API.
    """
    try:
        url_curr = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        resp = requests.get(url_curr, timeout=3.5)
        if resp.status_code == 200:
            data = resp.json()
            main = data.get("main", {})
            wind_obj = data.get("wind", {})
            rain_obj = data.get("rain", {})

            temp = float(main.get("temp", 22.0))
            humidity = float(main.get("humidity", 75.0))
            pressure = float(main.get("pressure", 1012.0))
            wind_kmh = float(wind_obj.get("speed", 3.0)) * 3.6
            rain_1h = float(rain_obj.get("1h", rain_obj.get("3h", 0.0) / 3.0))

            # Query 5-day / 3-hour forecast for 24h curve
            hourly_p = []
            hourly_t = []
            try:
                url_fc = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"
                r_fc = requests.get(url_fc, timeout=3.5)
                if r_fc.status_code == 200:
                    fc_list = r_fc.json().get("list", [])[:8] # 8 * 3h = 24h
                    for item in fc_list:
                        r_vol = float(item.get("rain", {}).get("3h", 0.0)) / 3.0
                        t_str = item.get("dt_txt", "").split(" ")[-1][:5]
                        hourly_p.append(round(r_vol, 2))
                        hourly_t.append(t_str or "00:00")
            except Exception:
                pass

            if not hourly_p:
                hourly_p = [round(max(0.0, rain_1h * (0.8 + 0.4 * math.sin(i / 3.0))), 2) for i in range(24)]
                hourly_t = [f"{i:02d}:00" for i in range(24)]

            return {
                "temp": temp,
                "humidity": humidity,
                "pressure": pressure,
                "wind_kmh": wind_kmh,
                "rain_1h": rain_1h,
                "hourly_p": hourly_p,
                "hourly_t": hourly_t
            }
    except Exception:
        pass
    return None

def fetch_weather_data(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetch live weather and 24-hour forecast from OpenWeatherMap (if API key activated)
    or Open-Meteo API (free live fallback).
    """
    import os
    from dotenv import load_dotenv
    load_dotenv()
    owm_key = os.getenv("OPENWEATHERMAP_API_KEY", "").strip()

    elevation, slope = get_elevation_and_slope(lat, lon)

    # 1. Try OpenWeatherMap API first if key provided
    if owm_key:
        owm_data = get_openweathermap_data(lat, lon, owm_key)
        if owm_data:
            rain_1h = owm_data["rain_1h"]
            hourly_p = owm_data["hourly_p"]
            rain_24h = round(sum(hourly_p) if hourly_p else rain_1h * 12.0, 2)
            soil_moisture = min(98.0, max(25.0, 30.0 + (rain_24h * 0.45) + (owm_data["humidity"] * 0.35)))

            return {
                "source": "OpenWeatherMap Live API",
                "is_live": True,
                "latitude": lat,
                "longitude": lon,
                "elevation_m": elevation,
                "slope_deg": slope,
                "rainfall_1h_mm": round(rain_1h, 2),
                "rainfall_24h_mm": rain_24h,
                "humidity_pct": round(owm_data["humidity"], 1),
                "temperature_c": round(owm_data["temp"], 1),
                "pressure_hpa": round(owm_data["pressure"], 1),
                "wind_speed_kmh": round(owm_data["wind_kmh"], 1),
                "soil_moisture_pct": round(soil_moisture, 1),
                "hourly_precipitation": hourly_p,
                "hourly_times": owm_data["hourly_t"]
            }

    # 2. Try Open-Meteo Live API
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m,weather_code",
        "hourly": "precipitation,temperature_2m,relative_humidity_2m",
        "forecast_days": 2,
        "timezone": "auto"
    }
    api_url = "https://api.open-meteo.com/v1/forecast"

    is_live = False
    data = None
    try:
        resp = requests.get(api_url, params=params, timeout=4.0)
        if resp.status_code == 200:
            data = resp.json()
            is_live = True
    except Exception:
        pass

    if is_live and data and "current" in data:
        current = data["current"]
        hourly = data.get("hourly", {})
        precip_hourly = hourly.get("precipitation", [])[:24]
        times_hourly = hourly.get("time", [])[:24]

        precip_1h = float(current.get("precipitation", 0.0))
        precip_24h = float(sum(precip_hourly)) if precip_hourly else precip_1h * 12.0
        humidity = float(current.get("relative_humidity_2m", 80.0))
        temp = float(current.get("temperature_2m", 21.0))
        pressure = float(current.get("surface_pressure", 915.0))
        wind = float(current.get("wind_speed_10m", 12.0))
        soil_moisture = min(98.0, max(25.0, 30.0 + (precip_24h * 0.45) + (humidity * 0.35)))

        source_label = "Open-Meteo Live (OWM Key Activating)" if owm_key else "Open-Meteo Live API"

        return {
            "source": source_label,
            "is_live": True,
            "latitude": lat,
            "longitude": lon,
            "elevation_m": elevation,
            "slope_deg": slope,
            "rainfall_1h_mm": round(precip_1h, 2),
            "rainfall_24h_mm": round(precip_24h, 2),
            "humidity_pct": round(humidity, 1),
            "temperature_c": round(temp, 1),
            "pressure_hpa": round(pressure, 1),
            "wind_speed_kmh": round(wind, 1),
            "soil_moisture_pct": round(soil_moisture, 1),
            "hourly_precipitation": [round(p, 2) for p in precip_hourly],
            "hourly_times": [t.split("T")[-1] for t in times_hourly]
        }

    return generate_simulated_weather(lat, lon, elevation, slope)

def generate_simulated_weather(lat: float, lon: float, elevation: float, slope: float) -> Dict[str, Any]:
    """
    Provides realistic hilly region weather telemetry if internet is disconnected.
    """
    import random
    # Seasonal monsoon baseline
    precip_1h = round(random.uniform(8.0, 42.0), 1)
    precip_24h = round(precip_1h * random.uniform(3.5, 6.0) + random.uniform(20.0, 60.0), 1)
    humidity = round(random.uniform(82.0, 96.0), 1)
    temp = round(random.uniform(18.0, 24.0), 1)
    pressure = round(1013.25 * (1 - 2.25577e-5 * elevation)**5.25588, 1)
    wind = round(random.uniform(14.0, 38.0), 1)
    soil_moisture = round(min(97.0, 45.0 + (precip_24h * 0.3)), 1)

    # 24h realistic hourly curve
    hourly_p = []
    base_t = precip_1h
    for h in range(24):
        p_val = max(0.0, base_t * (0.6 + 0.8 * math.sin(h / 3.8)) + random.uniform(-2, 5))
        hourly_p.append(round(p_val, 1))

    hourly_times = [f"{h:02d}:00" for h in range(24)]

    return {
        "source": "Terrain Hydro-Sim Engine (Offline Fallback)",
        "is_live": False,
        "latitude": lat,
        "longitude": lon,
        "elevation_m": elevation,
        "slope_deg": slope,
        "rainfall_1h_mm": precip_1h,
        "rainfall_24h_mm": precip_24h,
        "humidity_pct": humidity,
        "temperature_c": temp,
        "pressure_hpa": pressure,
        "wind_speed_kmh": wind,
        "soil_moisture_pct": soil_moisture,
        "hourly_precipitation": hourly_p,
        "hourly_times": hourly_times
    }

def generate_multilingual_messages(risk_level: str, location_name: str, rainfall_1h: float, slope: float) -> Dict[str, str]:
    """
    Generates tailored warning advisories in English, Kannada, and Hindi.
    """
    if risk_level == "Critical":
        return {
            "en": f"CRITICAL FLASH FLOOD RED ALERT in {location_name}! Torrential rain ({rainfall_1h} mm/h) on steep {slope}° slopes. Immediate evacuation to elevated shelters required. Avoid mountain streams!",
            "kn": f"ತುರ್ತು ಕೆಂಪು ಎಚ್ಚರಿಕೆ - {location_name}! ಕಡಿದಾದ {slope}° ಇಳಿಜಾರಿನಲ್ಲಿ ಭಾರಿ ಮಳೆ ({rainfall_1h} mm/h). ತಕ್ಷಣ ಎತ್ತರದ ಸುರಕ್ಷಿತ ಶಿಬಿರಗಳಿಗೆ ತೆರಳಿ. ನದಿ, ಹಳ್ಳಗಳಿಂದ ದೂರವಿರಿ!",
            "hi": f"अति गंभीर रेड अलर्ट - {location_name}! तीव्र ढलान ({slope}°) पर मूसलाधार वर्षा ({rainfall_1h} मिमी/घंटा)। तुरंत सुरक्षित ऊंचे राहत शिविरों में जाएं। नदी-नालों से दूर रहें!"
        }
    elif risk_level == "High":
        return {
            "en": f"HIGH FLASH FLOOD WARNING in {location_name}. Continuous heavy rainfall ({rainfall_1h} mm/h). High probability of gully torrents and slope runoff. Prepare emergency kit.",
            "kn": f"ಹೆಚ್ಚಿನ ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ - {location_name}. ನಿರಂತರ ಭಾರಿ ಮಳೆ ({rainfall_1h} mm/h). ಬೆಟ್ಟದ ಇಳಿಜಾರಿನಲ್ಲಿ ನೀರಿನ ಹರಿವು ತೀವ್ರವಾಗಿದೆ. ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಲು ಸಿದ್ಧರಾಗಿ.",
            "hi": f"उच्च जोखिम चेतावनी - {location_name}। लगातार भारी बारिश ({rainfall_1h} मिमी/घंटा)। पहाड़ी ढलानों पर पानी का तेज बहाव संभव है। सतर्क रहें।"
        }
    elif risk_level == "Medium":
        return {
            "en": f"Moderate Flash Flood Watch for {location_name}. Monsoon rainfall ({rainfall_1h} mm/h) on hilly terrain. Exercise caution near streams and low bridges.",
            "kn": f"ಮಧ್ಯಮ ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ - {location_name}. ಬೆಟ್ಟದ ಪ್ರದೇಶದಲ್ಲಿ ಮಳೆ ({rainfall_1h} mm/h). ಹಳ್ಳ-ಕೊಳ್ಳ ಮತ್ತು ಸೇತುವೆಗಳ ಬಳಿ ಜಾಗರೂಕರಾಗಿರಿ.",
            "hi": f"मध्यम जोखिम निगरानी - {location_name}। पहाड़ी क्षेत्रों में वर्षा ({rainfall_1h} मिमी/घंटा)। पुलियों और जलस्रोतों के पास सावधानी बरतें।"
        }
    else: # Low
        return {
            "en": f"Normal Status: Low flash flood probability in {location_name}. Rainfall is within safe drainage capacity.",
            "kn": f"ಸಾಮಾನ್ಯ ಸ್ಥಿತಿ: {location_name} ನಲ್ಲಿ ಪ್ರವಾಹದ ಅಪಾಯ ಕಡಿಮೆ. ನೀರಿನ ಹರಿವು ಸುರಕ್ಷಿತ ಮಿತಿಯಲ್ಲಿದೆ.",
            "hi": f"सामान्य स्थिति: {location_name} में बाढ़ का जोखिम न्यूनतम है। जल प्रवाह सुरक्षित सीमा में है।"
        }
