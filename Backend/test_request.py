import urllib.request
import urllib.parse
import json

API_URL = 'http://127.0.0.1:8000'
ENDPOINT = f"{API_URL}/api/users/password-reset/request/"

def test_request():
    print(f"Probando POST a {ENDPOINT}...")
    data = json.dumps({"email": "notificacionesdomyapp@gmail.com"}).encode('utf-8')
    req = urllib.request.Request(ENDPOINT, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            body = response.read().decode('utf-8')
            print(f"Status Code: {status}")
            print(f"Response Body: {body}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        print(f"Response Body: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Connection Error: {str(e)}")

if __name__ == '__main__':
    test_request()
