from flask import Flask, jsonify

app = Flask(__name__)
app.json.ensure_ascii = False   # 한글을 그대로 출력
app.json.sort_keys = False      # 키 순서 유지

@app.route('/')
def home():
    return jsonify({
        "service": "쇼핑몰 API",
        "version": "1.0.0",
        "status": "running"
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
