import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CSV_PATH = os.path.join(DATA_DIR, "historical_flood_data.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "flood_risk_model.joblib")
META_PATH = os.path.join(os.path.dirname(__file__), "model_metadata.json")

def generate_historical_dataset(num_samples: int = 1500) -> pd.DataFrame:
    """
    Generate realistic historical flash flood training data tailored for hilly terrain hydrology.
    Key variables:
      - rainfall_1h_mm: Current hourly rainfall intensity (0 - 120 mm/hr)
      - rainfall_24h_mm: Antecedent 24h cumulative rainfall (0 - 450 mm)
      - slope_deg: Terrain slope angle (5° to 50°)
      - soil_moisture_pct: Soil saturation percentage (15% to 98%)
      - elevation_m: Altitude in meters above sea level (300 to 2400 m)
      - pressure_hpa: Atmospheric pressure (880 to 1015 hPa)
      - river_distance_m: Distance to mountain stream/riverbed (20 to 3000 m)
    """
    np.random.seed(42)

    # 1. Rainfall distributions (monsoon hilly conditions)
    # Mixture of light, moderate, heavy, and cloudburst events
    rainfall_1h = np.concatenate([
        np.random.exponential(scale=6, size=int(num_samples * 0.45)),    # normal/light rain
        np.random.normal(loc=28, scale=8, size=int(num_samples * 0.30)), # moderate/heavy
        np.random.normal(loc=65, scale=18, size=int(num_samples * 0.25)) # cloudburst/torrential
    ])
    rainfall_1h = np.clip(rainfall_1h[:num_samples], 0.0, 130.0)

    # 2. Cumulative 24h rainfall correlated with 1h rainfall
    rainfall_24h = rainfall_1h * np.random.uniform(2.5, 5.5, size=num_samples) + np.random.exponential(scale=25, size=num_samples)
    rainfall_24h = np.clip(rainfall_24h, 0.0, 480.0)

    # 3. Slope in hilly regions (e.g. Western Ghats / Himalayas)
    slope_deg = np.random.triangular(left=5.0, mode=26.0, right=52.0, size=num_samples)

    # 4. Soil moisture percentage (higher when 24h rainfall is high)
    soil_moisture = 20.0 + (rainfall_24h / 480.0) * 65.0 + np.random.normal(0, 5.0, size=num_samples)
    soil_moisture = np.clip(soil_moisture, 15.0, 99.0)

    # 5. Elevation (mountainous relief)
    elevation_m = np.random.uniform(400, 2200, size=num_samples)

    # 6. Surface pressure (inversely correlated with elevation)
    # Standard barometric lapse rate approximation
    pressure_hpa = 1013.25 * (1 - 2.25577e-5 * elevation_m)**5.25588 + np.random.normal(0, 3.5, size=num_samples)

    # 7. River/gully proximity (meters)
    river_distance_m = np.random.exponential(scale=500, size=num_samples) + 25
    river_distance_m = np.clip(river_distance_m, 20.0, 3500.0)

    # Ground-truth Hydrological Risk Formula for Hilly Terrain:
    # Runoff factor = (Rainfall Intensity * 0.35) + (Cumulative Rain * 0.25) * (Soil Saturation / 100)
    # Slope acceleration factor = 1 + (slope / 45)^1.3
    # Proximity amplifier = max(0, (1 - river_distance / 1200))
    runoff_index = (
        (rainfall_1h * 0.42) + 
        (rainfall_24h * 0.18 * (soil_moisture / 100.0))
    ) * (1.0 + (slope_deg / 40.0)**1.2) * (1.0 + np.maximum(0.0, (1.0 - river_distance_m / 1500.0)) * 0.5)

    # Add realistic hydrological sensor noise / variability
    runoff_index += np.random.normal(0, 4.0, size=num_samples)

    # Assign risk classes: Low, Medium, High, Critical
    risk_labels = []
    for r in runoff_index:
        if r < 24:
            risk_labels.append("Low")
        elif r < 58:
            risk_labels.append("Medium")
        elif r < 105:
            risk_labels.append("High")
        else:
            risk_labels.append("Critical")

    df = pd.DataFrame({
        "rainfall_1h_mm": np.round(rainfall_1h, 2),
        "rainfall_24h_mm": np.round(rainfall_24h, 2),
        "slope_deg": np.round(slope_deg, 1),
        "soil_moisture_pct": np.round(soil_moisture, 1),
        "elevation_m": np.round(elevation_m, 1),
        "pressure_hpa": np.round(pressure_hpa, 1),
        "river_distance_m": np.round(river_distance_m, 1),
        "risk_level": risk_labels
    })

    return df

def train_and_evaluate():
    print("Generating historical flood dataset for hilly terrain...")
    df = generate_historical_dataset(num_samples=1600)
    
    os.makedirs(DATA_DIR, exist_ok=True)
    df.to_csv(CSV_PATH, index=False)
    print(f"Historical dataset saved to {CSV_PATH} ({len(df)} records)")
    print("Class distribution:")
    print(df["risk_level"].value_counts())

    # Features and target
    feature_cols = [
        "rainfall_1h_mm",
        "rainfall_24h_mm",
        "slope_deg",
        "soil_moisture_pct",
        "elevation_m",
        "pressure_hpa",
        "river_distance_m"
    ]
    X = df[feature_cols]
    y = df["risk_level"]

    # 80/20 train/test split with stratification
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Training Random Forest Classifier on {len(X_train)} samples...")
    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # Evaluation
    y_pred = model.predict(X_test)
    accuracy = float(accuracy_score(y_test, y_pred))
    report = classification_report(y_test, y_pred, output_dict=True)
    labels = ["Low", "Medium", "High", "Critical"]
    cm = confusion_matrix(y_test, y_pred, labels=labels).tolist()

    # Feature importances
    feature_importances = {
        col: float(imp) for col, imp in zip(feature_cols, model.feature_importances_)
    }
    # Sort descending
    sorted_importances = dict(sorted(feature_importances.items(), key=lambda item: item[1], reverse=True))

    print(f"Model Training Complete! Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report Summary:")
    for lbl in labels:
        if lbl in report:
            print(f" - {lbl:8s}: Precision={report[lbl]['precision']:.2f}, Recall={report[lbl]['recall']:.2f}, F1={report[lbl]['f1-score']:.2f}")

    # Persist model and metadata
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

    metadata = {
        "model_name": "Random Forest Flash Flood Classifier",
        "version": "1.0.0",
        "accuracy": round(accuracy, 4),
        "accuracy_pct": f"{accuracy * 100:.2f}%",
        "total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "feature_cols": feature_cols,
        "classes": labels,
        "feature_importances": sorted_importances,
        "confusion_matrix": {
            "labels": labels,
            "matrix": cm
        },
        "classification_report": report
    }

    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to {META_PATH}")

if __name__ == "__main__":
    train_and_evaluate()
