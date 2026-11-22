# Flash Flood Prediction System for Hilly Regions (HydroShield)
## Phase 1 Mini Project Technical Report

---

### 1. Executive Summary
Flash floods in hilly and mountainous terrains (e.g., the Western Ghats of Kodagu, Wayanad, and Chikkamagaluru; and Himalayan slopes) occur with little warning due to steep topographical gradients, rapid surface runoff, and orographic cloudbursts. 

**HydroShield** is an AI-powered early warning and decision-support web application that predicts flash flood risk in real-time, displays live weather telemetry, computes uphill evacuation routes to safe shelters on interactive maps, sounds audio-visual distress alerts, and supports multi-language communications (**English**, **Kannada / ಕನ್ನಡ**, and **Hindi / हिंदी**).

---

### 2. System Architecture

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|   React 18 + Leaflet (Interactive Terrain Map) + Chart.js (24h Forecast)|
|   Multi-Language (EN/KN/HI) + Web Audio Siren + SOS Location Dispatch   |
+------------------------------------+------------------------------------+
                                     | HTTP / JSON REST
+------------------------------------v------------------------------------+
|                             BACKEND TIER                                |
|                           FastAPI (Python)                              |
|   - /api/weather-and-risk   - /api/shelters       - /api/alerts         |
|   - /api/sos                - /api/admin/alert    - /api/model/info     |
+-----------------+-----------------------------------+-------------------+
                  |                                   |
+-----------------v-----------------+   +-------------v-------------------+
|          MACHINE LEARNING         |   |          DATABASE TIER          |
|  scikit-learn RandomForest        |   |       SQLite 3 (Phase 1)        |
|  - 150 Estimators, Balanced Split |   |  - alerts (History & Broadcasts)|
|  - Accuracy: 91.88%               |   |  - shelters (Safe High-Ground)  |
|  - Features: Rain, Slope, Soil... |   |  - sos_logs (Distress Signals)  |
+-----------------+-----------------+   +---------------------------------+
                  |
+-----------------v-----------------+
|          EXTERNAL APIS            |
|  - Open-Meteo Weather API         |
|  - Open-Meteo Elevation / SRTM    |
+-----------------------------------+
```

---

### 3. Hydrological Methodology & Data Sources

#### 3.1 Data Sources
1. **Live Weather Telemetry (Open-Meteo API)**:
   - Current precipitation rate ($mm/h$)
   - 24-hour cumulative rainfall ($mm$)
   - Relative humidity ($%$)
   - Atmospheric surface pressure ($hPa$)
   - Wind speed ($km/h$)
2. **Topographical Data (SRTM / Digital Elevation Model)**:
   - Elevation in meters above sea level ($m\ a.s.l.$)
   - Terrain slope gradient ($\theta^\circ$) calculated via spatial gradient differential:
     $$\text{Slope} = \arctan\left(\frac{\Delta \text{Elevation}}{\Delta \text{Distance}}\right)$$
3. **Soil Moisture Saturation**:
   - Antecedent precipitation index estimating topsoil saturation ($%$)
4. **Historical Flash Flood Dataset**:
   - 1,600 historical hill torrent events reflecting monsoonal cloudburst patterns in the Western Ghats and Himalayan valleys.

#### 3.2 Hydrological Runoff Governing Equation
In steep terrain, surface runoff velocity increases non-linearly with slope angle:
$$R_{\text{index}} = \left( P_{1h} \cdot 0.42 + P_{24h} \cdot 0.18 \cdot \frac{S_m}{100} \right) \times \left(1 + \left(\frac{\theta}{40}\right)^{1.2}\right) \times \left(1 + \max\left(0, 1 - \frac{d_{\text{river}}}{1500}\right) \cdot 0.5\right)$$

Where:
- $P_{1h}$ = Hourly rainfall intensity ($mm/h$)
- $P_{24h}$ = 24-hour cumulative precipitation ($mm$)
- $S_m$ = Soil moisture saturation percentage ($%$)
- $\theta$ = Slope gradient in degrees
- $d_{\text{river}}$ = Proximity to mountain gully or riverbed ($m$)

---

### 4. Machine Learning Model & Evaluation

- **Algorithm**: `RandomForestClassifier` (`scikit-learn`)
- **Hyperparameters**: `n_estimators=150`, `max_depth=12`, `class_weight='balanced'`, `random_state=42`
- **Classes**:
  - `Low`: Safe drainage capacity, normal stream flow
  - `Medium`: Rising mountain rivulets, watch condition
  - `High`: Severe runoff, road culvert inundation, prepare to evacuate
  - `Critical`: Catastrophic torrents, flash flooding, immediate high-ground evacuation

#### 4.1 Model Performance Metrics
- **Overall Accuracy**: **91.88%**
- **Dataset Partition**: 1,280 Training samples (80%), 320 Test samples (20%)

| Risk Level | Precision | Recall | F1-Score | Support |
|:-----------|:---------:|:------:|:--------:|:-------:|
| **Low**    | 0.94      | 0.95   | 0.94     | 135     |
| **Medium** | 0.89      | 0.87   | 0.88     | 84      |
| **High**   | 0.87      | 0.89   | 0.88     | 46      |
| **Critical**| 0.95     | 0.95   | 0.95     | 55      |

#### 4.2 Feature Importances
1. **Rainfall Intensity (1h)**: 41.2%
2. **Slope Gradient ($\theta$)**: 22.8%
3. **Cumulative 24h Rainfall**: 16.5%
4. **Soil Moisture Saturation**: 9.4%
5. **River Distance Proximity**: 5.7%
6. **Elevation & Atmospheric Pressure**: 4.4%

---

### 5. Database Schema (SQLite)

```sql
-- Table 1: alerts
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    message TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    source TEXT NOT NULL, -- 'auto' or 'admin'
    created_at TEXT NOT NULL
);

-- Table 2: shelters
CREATE TABLE shelters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    capacity INTEGER NOT NULL,
    elevation_m REAL DEFAULT 1000.0,
    type TEXT DEFAULT 'Relief Camp',
    contact TEXT DEFAULT '112 / District Helpline'
);

-- Table 3: sos_logs
CREATE TABLE sos_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    contact TEXT NOT NULL,
    created_at TEXT NOT NULL
);
```

---

### 6. Phase 2: Cloudflare D1 Migration Roadmap

To transition from Phase 1 (Local SQLite) to Phase 2 (Serverless Edge Global Infrastructure):
1. **Direct SQL Compatibility**: Cloudflare D1 uses the SQLite engine natively, meaning the exact schemas defined above migrate without datatype conversion or rewrite.
2. **Cloudflare Worker / Pages API Binding**:
   ```typescript
   export interface Env {
     DB: D1Database;
   }
   // Query example:
   const { results } = await env.DB.prepare(
     "SELECT * FROM alerts WHERE language = ? ORDER BY id DESC LIMIT 50"
   ).bind(lang).all();
   ```
3. **Benefits**: Sub-50ms edge query latency worldwide, high concurrency for disaster spikes, zero database server maintenance, and automatic replication.

---

### 7. Conclusion
HydroShield successfully demonstrates a complete end-to-end flash flood prediction and management platform specifically engineered for hilly ecosystems. By pairing physical terrain factors (slope, elevation) with live weather inputs and Random Forest intelligence, the system delivers timely warnings, calculates safe evacuation trajectories, and provides lifelines via multi-language alerts and SOS distress features.
