import urllib.request
import json

# Probamos con la IP real que usa el front
API_URL = 'http://10.10.12.230:8000'
ENDPOINT = f"{API_URL}/api/users/password-reset/request/"

def test_request():
    print(f"Probando POST a {ENDPOINT}...")
    data = json.dumps({"email": "notificacionesdomyapp@gmail.com"}).encode('utf-8')
    req = urllib.request.Request(ENDPOINT, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            print(f"Status Code: {response.getcode()}")
            print(f"Response: {response.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    test_request()
