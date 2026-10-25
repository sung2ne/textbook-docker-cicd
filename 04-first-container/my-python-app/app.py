# 파일: app.py
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json

class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"message": "안녕하세요! Docker 컨테이너에서 실행 중입니다."}
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode())

server = HTTPServer(('0.0.0.0', 5000), MyHandler)
print("서버가 5000번 포트에서 시작되었습니다.")
server.serve_forever()
