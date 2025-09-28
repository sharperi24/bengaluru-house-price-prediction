from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from server import util 
import os

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), "../client"), static_url_path="")
CORS(app)

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "app.html")

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    locations = util.get_location_names()
    print("Locations:", locations)  # Debug print
    response = jsonify({
        'locations': locations
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    try:
        data = request.get_json(force=True)
        total_sqft = float(data['total_sqft'])
        location = data['location']
        bhk = int(data['bhk'])
        bath = int(data['bath'])

        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
        response = jsonify({'estimated_price': estimated_price})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print("Error in /predict_home_price:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)