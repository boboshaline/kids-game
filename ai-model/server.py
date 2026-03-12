import os
import json
import random
import numpy as np
import re
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

app = Flask(__name__)
CORS(app)

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Note: We now use the 'train' folder for both quizzes and class discovery
DATASET_PATH = os.path.join(BASE_DIR, "dataset/train")
MODEL_PATH = os.path.join(BASE_DIR, "play2learn_model.h5")
LABELS_PATH = os.path.join(BASE_DIR, "labels.json")

# --- 1. Load Model ---
print(f"--- Loading AI Model from {MODEL_PATH} ---")
model = load_model(MODEL_PATH)

# --- 2. Load Labels (Updated for new format) ---
# New format is {"0": "apple", "1": "banana"}
with open(LABELS_PATH, "r") as f:
    idx_to_class = json.load(f)
    # Ensure keys are integers for easy lookup later
    idx_to_class = {int(k): v for k, v in idx_to_class.items()}

# --- 3. Detect All Valid Folders ---
all_classes = [
    cls for cls in os.listdir(DATASET_PATH)
    if os.path.isdir(os.path.join(DATASET_PATH, cls))
]

# --- 4. Level Configuration ---
LEVEL_CONFIG = {
    "beginner": ["dog", "cat", "apple", "banana", "orange", "chicken"],
    "medium": ["cow", "horse", "strawberry", "grape", "elephant", "butterfly", "avocado"],
    "advanced": ["pomegranate", "kiwi", "mango", "squirrel", "sheep", "watermelon"]
}

# --- 5. Serve Images ---
# This allows your frontend to actually see the images via URL
@app.route('/images/<class_name>/<filename>')
def serve_image(class_name, filename):
    return send_from_directory(os.path.join(DATASET_PATH, class_name), filename)

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json() or {}
    level = data.get("level", "beginner").lower()
    num_questions = int(data.get("num_questions", 1))

    allowed_for_level = LEVEL_CONFIG.get(level, all_classes)
    available_pool = [c for c in allowed_for_level if c in all_classes]
    
    if not available_pool:
        available_pool = all_classes

    quizzes = []
    option_id_counter = 1000

    for q_idx in range(num_questions):
        target_class = random.choice(available_pool)
        target_dir = os.path.join(DATASET_PATH, target_class)
        images_in_folder = [f for f in os.listdir(target_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        target_image_name = random.choice(images_in_folder)
        target_img_path = os.path.join(target_dir, target_image_name)

        # AI Prediction logic
        img = image.load_img(target_img_path, target_size=(224, 224))
        x = image.img_to_array(img) / 255.0
        x = np.expand_dims(x, axis=0)
        
        preds = model.predict(x, verbose=0)
        predicted_idx = int(np.argmax(preds, axis=1)[0])
        
        # Use our new label map
        predicted_label = idx_to_class.get(predicted_idx, target_class)

        # --- Build Options ---
        # Ensure we have enough wrong options from the level pool
        other_classes = [c for c in available_pool if c != predicted_label]
        if len(other_classes) < 3:
            other_classes = [c for c in all_classes if c != predicted_label]

        wrong_options = random.sample(other_classes, 3)
        options_list = wrong_options + [predicted_label]
        random.shuffle(options_list)

        options_data = []
        correct_option_id = None
        for opt_name in options_list:
            current_id = option_id_counter
            if opt_name == predicted_label:
                correct_option_id = current_id

            opt_dir = os.path.join(DATASET_PATH, opt_name)
            opt_imgs = [f for f in os.listdir(opt_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            
            options_data.append({
                "id": current_id,
                "name": opt_name,
                "image": f"http://localhost:5001/images/{opt_name}/{random.choice(opt_imgs)}"
            })
            option_id_counter += 1

        quizzes.append({
            "id": q_idx + 1,
            "level": level,
            "target": {
                "id": correct_option_id,
                "name": predicted_label,
                "image": f"http://localhost:5001/images/{target_class}/{target_image_name}"
            },
            "options": options_data,
            "answer": predicted_label
        })

    return jsonify(quizzes)

if __name__ == '__main__':
    # Running on 5001 to avoid conflicts with other local services
    app.run(host='0.0.0.0', port=5001, debug=False)