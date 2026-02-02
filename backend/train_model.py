import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from feature_extraction import extract_features

# Mock Dataset
# 0 = Safe, 1 = Phishing
# We will create some synthetic data based on our feature extraction logic to train a dummy model.

# Features: [Length, Dots, Hyphens, @, Digits, Subdomains, HTTPS]

X = [
    # Safe URLs
    extract_features("https://www.google.com"),
    extract_features("https://www.youtube.com"),
    extract_features("https://www.facebook.com"),
    extract_features("https://www.amazon.com"),
    extract_features("https://www.wikipedia.org"),
    extract_features("https://github.com"),
    extract_features("https://stackoverflow.com"),
    extract_features("https://www.microsoft.com"),
    extract_features("https://www.apple.com"),
    extract_features("https://www.linkedin.com"),
    
    # Phishing URLs (Simulated)
    extract_features("http://secure-login-paypal.com.account-update.info"),
    extract_features("http://apple-id-verify.com/login"),
    extract_features("http://www.google-security-check.tk"),
    extract_features("http://faceb00k-login.com"),
    extract_features("http://amazon-prime-refund.net"),
    extract_features("http://bank-of-america-secure.com.verify.me"),
    extract_features("http://netflix-payment-update.com"),
    extract_features("http://wellsfargo-verify-identity.com"),
    extract_features("http://chase-bank-login-secure.com"),
    extract_features("http://irs-tax-refund-claim.com"),
]

y = [0] * 10 + [1] * 10

# Train Model
print("Training Random Forest Model...")
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X, y)

# Save Model
joblib.dump(clf, 'phishing_model.pkl')
print("Model saved to phishing_model.pkl")

# Test
test_url = "http://secure-login-paypal.com"
print(f"Testing URL: {test_url}")
feats = np.array(extract_features(test_url)).reshape(1, -1)
pred = clf.predict(feats)[0]
print(f"Prediction: {'Phishing' if pred == 1 else 'Safe'}")
