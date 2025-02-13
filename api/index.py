from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json
import requests
from bs4 import BeautifulSoup

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        url = data.get('url')

        if url:
            response = requests.get(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            images = []
            for img in soup.find_all('img'):
                src = img.get('src')
                alt = img.get('alt', '')
                if src:
                    images.append({"src": src, "alt": alt})

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"images": images}).encode())
        else:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "URL not provided"}).encode())
