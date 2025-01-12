from flask import Flask, request, jsonify, send_from_directory, abort
import os
import json
import base64
import httpx
from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()

import google.generativeai as genai

genai.configure(api_key=os.getenv("GENAI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# Initialize Flask app
app = Flask(__name__, static_folder='../client/dist')

# Serve the index.html file
@app.route('/')
def serve_index():
    try:
        # Serve the index.html file from the client/dist/ directory
        return send_from_directory(app.static_folder, 'index.html')
    except FileNotFoundError:
        abort(404, description="Index file not found.")

# Serve static files from the assets/ directory
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    assets_folder = os.path.join(app.static_folder, 'assets')
    try:
        # Serve files from the assets directory
        return send_from_directory(assets_folder, filename)
    except FileNotFoundError:
        abort(404, description=f"File {filename} not found in assets folder.")

# API route to handle GET and POST requests to /api/questions
@app.route('/api/questions', methods=['GET', 'POST'])
def get_questions():
    # Path to the questions.json file
    questions_file_path = os.path.join(os.path.dirname(__file__), 'questions.json')

    # Check if the JSON file exists
    if not os.path.exists(questions_file_path):
        abort(404, description="Questions file not found.")

    # Open and return the content of the JSON file
    try:
        with open(questions_file_path, 'r') as f:
            questions_data = json.load(f)
        return jsonify(questions_data)
    except json.JSONDecodeError:
        abort(500, description="Error decoding the JSON file.")

# API route to handle file uploads
@app.route('/api/upload', methods=['POST'])
def upload_file():
    # Check if a file was provided in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    # Check if the file has a valid name
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Read the file content
        file_content = file.read()

        # Base64 encode the file content
        encoded_file = base64.standard_b64encode(file_content).decode("utf-8")
        
        # Define the prompt for the processing API
        prompt_file = open("prompt.txt", "r")
        prompt = prompt_file.read()
        
        # Send the file and prompt to the processing API
        model_api_response = model.generate_content([{'mime_type': 'text/plain', 'data': encoded_file}, prompt])

        # try:
        #     f = open("./questions.json", 'r')
        #     questions_data = f.read()
        #     return jsonify({"questions": questions_data})
        # except json.JSONDecodeError:
        #     abort(500, description="Error decoding the JSON file.")

        print(model_api_response.text)
        
        # Return the API response to the frontend
        return jsonify({"questions": model_api_response.text})
    
    except Exception as e:
        print(e)
        return jsonify({"error": f"An error occurred while processing the file: {str(e)}"}), 500


# Error handler for 404 errors
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': str(error)}), 404

# Error handler for 500 errors
@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': str(error)}), 500

if __name__ == '__main__':
    # Run the app on localhost with debugging enabled
    app.run(host='0.0.0.0', port=5000, debug=True)