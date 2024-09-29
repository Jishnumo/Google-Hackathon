from flask import Flask, request, jsonify
from deepface import DeepFace
import base64
import os
import firebase_admin
from firebase_admin import credentials, firestore
import requests

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Function to call Gemini API
def get_recommendation(emotion):
    api_url = "https://api.gemini.com/v1/recommend"
    headers = {
        "Authorization": "Bearer YOUR_GEMINI_API_KEY",
        "Content-Type": "application/json"
    }
    prompt = f"Give a 5-word recommendation for someone feeling {emotion}."
    payload = {
        "model": "gemini-1.5-flash",
        "prompt": prompt,
        "max_tokens": 5
    }

    response = requests.post(api_url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json().get("generated_text", "No recommendation available")
    else:
        return "Error generating recommendation"

# Endpoint for emotion detection
@app.route('/api/detect_emotion', methods=['POST'])
def detect_emotion():
    try:
        # Get the base64 image from the request
        data = request.json.get('image')
        if not data:
            return jsonify({"error": "No image provided"}), 400

        # Decode the base64 image and save it as a file
        image_data = base64.b64decode(data.split(",")[1])
        image_path = "user_image.jpg"
        with open(image_path, "wb") as f:
            f.write(image_data)

        # Detect emotion using DeepFace
        result = DeepFace.analyze(img_path=image_path, actions=['emotion'], enforce_detection=False)
        emotion = result["dominant_emotion"]

        # Get recommendation from Gemini API
        recommendation = get_recommendation(emotion)

        # Store data in Firebase Firestore
        user_data = {
            "name": "Anonymous",  # Replace this with actual user data if available
            "age": "Unknown",     # Replace this with actual user data if available
            "emotion": emotion,
            "recommendation": recommendation
        }
        db.collection('users').add(user_data)

        # Return the detected emotion and recommendation to the frontend
        return jsonify({"emotion": emotion, "recommendation": recommendation})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500


if __name__ == '__main__':
    app.run(debug=True)
