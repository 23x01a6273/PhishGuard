from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from feature_extraction import extract_features
from forensic_tools import (
    get_ssl_details, get_domain_info, get_server_info, 
    analyze_content, get_redirect_chain, calculate_risk_score
)
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model (if exists, otherwise use a placeholder)
MODEL_PATH = 'phishing_model.pkl'
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print("Model not found. Please train the model first.")

@app.route('/api/scan', methods=['POST'])
def scan_url():
    data = request.json
    url = data.get('url', '')
    
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    # Ensure URL has schema
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    try:
        parsed = urlparse(url)
        hostname = parsed.netloc
        domain = hostname # Simplification, ideally strip subdomains for whois
    except:
        return jsonify({'error': 'Invalid URL format'}), 400

    # --- 1. REAL FORENSIC ANALYSIS ---
    # These functions perform real network requests
    print(f"Starting forensic analysis for: {url}")
    
    ssl_data = get_ssl_details(hostname)
    domain_data = get_domain_info(domain)
    server_data = get_server_info(hostname)
    content_data = analyze_content(url)
    redirect_data = get_redirect_chain(url)
    
    # Calculate Risk Score based on real findings
    risk_score = calculate_risk_score(ssl_data, domain_data, content_data, redirect_data)
    
    # --- 2. ML PREDICTION (Hybrid Approach) ---
    features = extract_features(url)
    ml_confidence = 0
    ml_result = "UNKNOWN"

    if model:
        try:
            features_array = np.array(features).reshape(1, -1)
            prediction = model.predict(features_array)[0]
            probability = model.predict_proba(features_array)[0][1] if hasattr(model, 'predict_proba') else 0.0
            
            ml_result = "PHISHING" if prediction == 1 else "SAFE"
            ml_confidence = probability * 100 if prediction == 1 else (1 - probability) * 100
        except:
            pass
    
    # --- 3. FINAL VERDICT ---
    # Combine ML and Heuristic/Forensic score
    # If Risk Score is High (>70), override ML if ML says Safe
    
    final_result = ml_result
    if risk_score > 75:
        final_result = "PHISHING"
    elif risk_score < 30 and ml_result == "UNKNOWN":
        final_result = "SAFE"
        
    threat_type = "Safe"
    if final_result == "PHISHING":
        if "login" in content_data.get('keywords', []):
            threat_type = "Credential Harvesting"
        elif domain_data.get('age_days', 100) < 30:
            threat_type = "Newly Registered Domain"
        else:
            threat_type = "Malicious Content"

    return jsonify({
        'url': url,
        'result': final_result,
        'confidence': round(max(ml_confidence, float(risk_score)), 2),
        'riskScore': risk_score,
        'threatType': threat_type,
        'details': {
            'ssl': ssl_data,
            'domain': domain_data,
            'content': content_data,
            'redirects': redirect_data,
            'server': server_data
        },
        'features': {
            'length': len(url),
            'suspicious_chars': sum(1 for c in url if c in ['@', '-', '//']),
            'subdomains': url.count('.') - 1,
            'https': url.startswith('https')
        }
    })

# --- MOCK AUTH ENDPOINTS ---

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Mock validation
    if email == "admin@phishguard.com" and password == "password":
        return jsonify({'message': 'Login successful', 'token': 'mock-jwt-token-123', 'user': {'name': 'Admin User', 'email': email}}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    
    # Mock creation
    return jsonify({'message': 'User created successfully', 'user': {'email': email}}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
