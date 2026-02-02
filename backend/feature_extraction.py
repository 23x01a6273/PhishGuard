import re
from urllib.parse import urlparse

def extract_features(url):
    """
    Extracts features from a URL for phishing detection.
    Returns a list of numerical features.
    
    Features:
    1. Length of URL
    2. Number of dots
    3. Number of hyphens
    4. Number of @ symbols
    5. Number of digits
    6. Number of subdomains
    7. Is HTTPS (1 if yes, 0 if no)
    """
    
    features = []
    
    # 1. Length of URL
    features.append(len(url))
    
    # 2. Number of dots
    features.append(url.count('.'))
    
    # 3. Number of hyphens
    features.append(url.count('-'))
    
    # 4. Number of @ symbols
    features.append(url.count('@'))
    
    # 5. Number of digits
    features.append(sum(c.isdigit() for c in url))
    
    # Parse URL
    parsed = urlparse(url)
    hostname = parsed.netloc
    
    # 6. Number of subdomains (rough estimate based on dots in hostname)
    # e.g., www.google.com -> 2 dots. google.com -> 1 dot. 
    # Usually, > 3 dots in hostname is suspicious.
    features.append(hostname.count('.'))
    
    # 7. Is HTTPS
    features.append(1 if parsed.scheme == 'https' else 0)
    
    return features
