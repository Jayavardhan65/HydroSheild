import sqlite3
import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "flash_flood.db")
SHELTERS_JSON = os.path.join(os.path.dirname(__file__), "data", "shelters.json")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Table 1: alerts
    # (id, location, risk_level, message, language, source [auto/admin], created_at)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        message TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'en',
        source TEXT NOT NULL, -- 'auto' or 'admin'
        created_at TEXT NOT NULL
    )
    """)

    # Table 2: shelters
    # (id, name, lat, lon, capacity, [plus elevation_m, type, contact for map & rescue finder])
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS shelters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        capacity INTEGER NOT NULL,
        elevation_m REAL DEFAULT 1000.0,
        type TEXT DEFAULT 'Relief Camp',
        contact TEXT DEFAULT '112 / District Helpline'
    )
    """)

    # Table 3: sos_logs
    # (id, lat, lon, contact, created_at)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sos_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        contact TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()

    # Seed shelters if empty
    cursor.execute("SELECT COUNT(*) as count FROM shelters")
    count = cursor.fetchone()["count"]
    if count == 0 and os.path.exists(SHELTERS_JSON):
        with open(SHELTERS_JSON, "r", encoding="utf-8") as f:
            shelters_data = json.load(f)
        for s in shelters_data:
            cursor.execute("""
            INSERT INTO shelters (name, lat, lon, capacity, elevation_m, type, contact)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (s["name"], s["lat"], s["lon"], s["capacity"], s.get("elevation_m", 1000.0), s.get("type", "Relief Center"), s.get("contact", "+91 82722 28432")))
        conn.commit()

    # Seed initial alerts if empty
    cursor.execute("SELECT COUNT(*) as count FROM alerts")
    if cursor.fetchone()["count"] == 0:
        seed_alerts = [
            ("Madikeri / Kodagu", "High", "High Flash Flood Risk: Heavy rainfall on 32.5° steep slopes. Prepare to move to high ground.", "en", "auto", "2026-10-27 19:30:00"),
            ("Madikeri / Kodagu", "High", "ಹೆಚ್ಚಿನ ಫ್ಲ್ಯಾಶ್ ಪ್ರವಾಹ ಅಪಾಯ: ಕಡಿದಾದ ಇಳಿಜಾರುಗಳಲ್ಲಿ ಭಾರಿ ಮಳೆ. ಎತ್ತರದ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಿ.", "kn", "auto", "2026-10-27 19:30:00"),
            ("Madikeri / Kodagu", "High", "उच्च आकस्मिक बाढ़ का खतरा: ढलानों पर भारी वर्षा। सुरक्षित ऊंचे स्थानों पर जाएं।", "hi", "auto", "2026-10-27 19:30:00"),
            ("Wayanad / Meppadi", "Critical", "CRITICAL EVACUATION ORDER: Severe mountain runoff detected in Meppadi stream catchment. Immediate evacuation to relief camps.", "en", "admin", "2026-10-27 21:15:00"),
            ("Chikkamagaluru", "Medium", "Medium Risk Advisory: Continuous hill showers. Stay away from mountain streams and culverts.", "en", "auto", "2026-10-27 23:45:00")
        ]
        for a in seed_alerts:
            cursor.execute("""
            INSERT INTO alerts (location, risk_level, message, language, source, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """, a)
        conn.commit()

    conn.close()

def log_alert_multi(location: str, risk_level: str, messages: Dict[str, str], source: str = "auto", timestamp: Optional[str] = None) -> int:
    if not timestamp:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = get_connection()
    cursor = conn.cursor()
    last_id = None
    for lang, msg in messages.items():
        cursor.execute("""
        INSERT INTO alerts (location, risk_level, message, language, source, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (location, risk_level, msg, lang, source, timestamp))
        last_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return last_id or 0

def get_alerts(limit: int = 50, language: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    if language:
        cursor.execute("SELECT * FROM alerts WHERE language = ? ORDER BY id DESC LIMIT ?", (language, limit))
    else:
        cursor.execute("SELECT * FROM alerts ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_latest_alert_for_location(location: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE location = ? ORDER BY id DESC LIMIT 1", (location,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_active_admin_alerts() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE source = 'admin' ORDER BY id DESC LIMIT 5")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_all_shelters() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM shelters ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def log_sos(lat: float, lon: float, contact: str) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
    INSERT INTO sos_logs (lat, lon, contact, created_at)
    VALUES (?, ?, ?, ?)
    """, (lat, lon, contact, created_at))
    sos_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return sos_id

def get_sos_logs(limit: int = 30) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sos_logs ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
