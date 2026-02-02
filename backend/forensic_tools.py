import ssl
import socket
import whois
import requests
import datetime
from urllib.parse import urlparse
from bs4 import BeautifulSoup

def get_ssl_details(hostname):
    """
    Analyzes SSL certificate for a given hostname.
    """
    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                
                # Extract details
                subject = dict(x[0] for x in cert['subject'])
                issuer = dict(x[0] for x in cert['issuer'])
                not_before = datetime.datetime.strptime(cert['notBefore'], '%b %d %H:%M:%S %Y %Z')
                not_after = datetime.datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                
                # Check validity
                now = datetime.datetime.now()
                is_valid = not_before <= now <= not_after
                days_left = (not_after - now).days
                
                return {
                    "issuer": issuer.get('organizationName', issuer.get('commonName', 'Unknown')),
                    "issued_on": not_before.strftime('%b %d, %Y'),
                    "expires": not_after.strftime('%b %d, %Y'),
                    "days_left": days_left,
                    "valid": is_valid
                }
    except Exception as e:
        return {
            "issuer": "Not Found / Error",
            "issued_on": "N/A",
            "expires": "N/A",
            "valid": False,
            "error": str(e)
        }

def get_domain_info(domain):
    """
    Fetches WHOIS information for a domain.
    """
    try:
        w = whois.whois(domain)
        
        # Handle multiple values (some registrars return lists)
        registrar = w.registrar[0] if isinstance(w.registrar, list) else w.registrar
        creation_date = w.creation_date[0] if isinstance(w.creation_date, list) else w.creation_date
        
        # Calculate domain age
        age_days = 0
        created_str = "Unknown"
        if isinstance(creation_date, datetime.datetime):
            age_days = (datetime.datetime.now() - creation_date).days
            created_str = creation_date.strftime('%Y-%m-%d')
            
            # Simple "2 hours ago" or "X years ago" formatting
            if age_days < 1:
                created_str = "Today"
            elif age_days < 30:
                created_str = f"{age_days} days ago"
            else:
                years = age_days // 365
                created_str = f"{years} years ago" if years > 0 else f"{age_days} days ago"

        return {
            "registrar": registrar or "Unknown",
            "created": created_str,
            "age_days": age_days,
            "raw_creation_date": str(creation_date)
        }
    except Exception as e:
        return {
            "registrar": "Hidden / Error",
            "created": "Unknown",
            "age_days": -1,
            "error": str(e)
        }

def get_server_info(hostname):
    """
    Gets IP address and basic server info.
    """
    try:
        ip = socket.gethostbyname(hostname)
        
        # Mocking location/provider to avoid external API keys for now
        # In a real production app, use ipinfo.io or maxmind
        # But we can try a free no-auth API if available, or just mock it for stability
        
        location = "Unknown"
        provider = "Unknown"
        
        # Attempt free IP-API (rate limited but works for demos)
        try:
            r = requests.get(f"http://ip-api.com/json/{ip}", timeout=3)
            if r.status_code == 200:
                data = r.json()
                location = f"{data.get('city', 'Unknown')}, {data.get('countryCode', 'Unknown')}"
                provider = data.get('isp', 'Unknown')
        except:
            pass # Fallback to unknown if API fails

        return {
            "ip": ip,
            "location": location,
            "provider": provider,
            "blacklist": "Clean" # Mock blacklist status for now
        }
    except Exception as e:
        return {
            "ip": "N/A",
            "location": "N/A",
            "provider": "N/A",
            "blacklist": "Unknown",
            "error": str(e)
        }

def analyze_content(url):
    """
    Scrapes content and checks for phishing keywords.
    """
    phishing_keywords = ["login", "verify", "account", "password", "urgent", "update", "suspend", "bank", "secure"]
    
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text().lower()
        
        detected_keywords = [kw for kw in phishing_keywords if kw in text]
        
        # Homoglyph detection (simplified)
        homoglyphs = "None"
        if "xn--" in url: # Punycode detection
            homoglyphs = "Punycode Detected"
            
        status = "Suspicious" if len(detected_keywords) > 2 else "Clean"
        
        return {
            "status": status,
            "keywords": detected_keywords[:5], # Top 5
            "homoglyphs": homoglyphs
        }
    except Exception as e:
        return {
            "status": "Unknown (Access Denied)",
            "keywords": [],
            "homoglyphs": "Unknown",
            "error": str(e)
        }

def get_redirect_chain(url):
    """
    Follows redirects to see the path.
    """
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.head(url, allow_redirects=True, headers=headers, timeout=5)
        
        chain = []
        # If there are history items (redirects)
        for resp in response.history:
            chain.append({
                "source": resp.url,
                "code": resp.status_code
            })
        
        # Add final destination
        chain.append({
            "source": response.url,
            "code": response.status_code
        })
        
        return chain
    except Exception as e:
        return [
            {"source": url, "code": "Error"},
            {"source": str(e), "code": 0}
        ]

def calculate_risk_score(ssl_data, domain_data, content_data, redirect_data):
    """
    Calculates a risk score (0-100) based on gathered forensic data.
    """
    score = 10 # Base score (low risk)
    
    # SSL Factors
    if not ssl_data.get('valid'):
        score += 40
    elif ssl_data.get('days_left', 365) < 30:
        score += 10 # Expiring soon is slightly suspicious if combined with other things
    
    # Domain Factors
    if domain_data.get('age_days', 1000) < 30 and domain_data.get('age_days') != -1:
        score += 50 # New domains are high risk
    
    # Content Factors
    if content_data.get('status') == 'Suspicious':
        score += 30
        
    # Redirect Factors
    if len(redirect_data) > 2:
        score += 20
        
    # Cap at 100
    return min(score, 99)
