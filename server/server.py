from flask import Flask, request, jsonify
from flask_cors import CORS
from server import util
import os

app = Flask(__name__)
CORS(app)  # Allow frontend requests from any domain

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    locations = util.get_location_names()
    return jsonify({'locations': locations})

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.json  # Expect JSON payload
    try:
        total_sqft = float(data['total_sqft'])
        bhk = int(data['bhk'])
        bath = int(data['bath'])
        location = data['location']
    except Exception as e:
        return jsonify({'error': f"Invalid input: {str(e)}"}), 400

    estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
    return jsonify({'estimated_price': estimated_price})

if __name__ == "__main__":
    print("Loading artifacts...")
    util.load_saved_artifacts()
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
