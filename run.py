import os
import sys
import uvicorn

def main():
    print("=" * 70)
    print(" HydroShield: Flash Flood Prediction System for Hilly Regions ")
    print("=" * 70)

    # 1. Check if model exists, if not, train it
    model_path = os.path.join(os.path.dirname(__file__), "backend", "ml", "flood_risk_model.joblib")
    if not os.path.exists(model_path):
        print("\n[+] Model not found. Initializing Random Forest training pipeline...")
        from backend.ml.train_model import train_and_evaluate
        train_and_evaluate()
    else:
        print("\n[+] Trained Random Forest model found at:", model_path)

    # 2. Initialize database
    print("[+] Initializing SQLite database (alerts, shelters, sos_logs)...")
    from backend.database import init_db
    init_db()
    print("[+] Database initialized successfully.")

    # 3. Launch server
    import socket
    def is_port_in_use(port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('127.0.0.1', port)) == 0

    port = 8000
    if is_port_in_use(port):
        port = 8001
        if is_port_in_use(port):
            port = 8080

    print(f"\n[+] Starting FastAPI server on http://localhost:{port}")
    print(f"[+] Local Network (Mobile access): http://10.155.248.218:{port}")
    print(f"[+] Open your browser at http://localhost:{port} to view the Dashboard")
    print("=" * 70)
    
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)

if __name__ == "__main__":
    main()
