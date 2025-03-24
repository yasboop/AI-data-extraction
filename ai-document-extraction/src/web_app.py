from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import os
import requests
import json
from pathlib import Path

app = Flask(__name__)
app.secret_key = "ai_document_extraction_secret_key"

# Configuration
API_URL = "http://localhost:9001"
UPLOAD_FOLDER = Path("data/uploads")
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'txt'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    
    file = request.files['file']
    document_type = request.form.get('document_type', 'invoice')
    
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    
    if file and allowed_file(file.filename):
        # Save file temporarily
        filepath = UPLOAD_FOLDER / file.filename
        file.save(filepath)
        
        # Send to API
        try:
            with open(filepath, 'rb') as f:
                files = {'file': (file.filename, f)}
                data = {'document_type': document_type}
                response = requests.post(f"{API_URL}/extract", files=files, data=data)
                
            if response.status_code == 200:
                result = response.json()
                return render_template('result.html', filename=file.filename, 
                                      document_type=document_type, 
                                      data=result['data'])
            else:
                flash(f"Error from API: {response.text}")
                return redirect(url_for('index'))
                
        except Exception as e:
            flash(f"Error processing file: {str(e)}")
            return redirect(url_for('index'))
            
    flash('File type not allowed')
    return redirect(url_for('index'))

@app.route('/health')
def health():
    try:
        response = requests.get(f"{API_URL}/health")
        return jsonify({
            "web_app": "healthy",
            "api": response.json()
        })
    except Exception as e:
        return jsonify({
            "web_app": "healthy",
            "api": {"status": "error", "message": str(e)}
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 