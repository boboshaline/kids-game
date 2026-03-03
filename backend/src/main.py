import os
import json
import random
import sys

# --- Arguments ---
level = sys.argv[1] if len(sys.argv) > 1 else "beginner"
num_questions = int(sys.argv[2]) if len(sys.argv) > 2 else 1

# --- Dataset Path ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.abspath(os.path.join(BASE_DIR, "../../ai-model/dataset/train"))

all_classes = [
    cls for cls in os.listdir(DATASET_PATH)
    if os.path.isdir(os.path.join(DATASET_PATH, cls)) and len(os.listdir(os.path.join(DATASET_PATH, cls))) > 0
]

level_map = {
    "beginner": ["cat", "dog", "apple", "banana"],
    "medium": ["lion", "grapes"],
    "advanced": [] 
}

available_classes = [cls for cls in level_map.get(level, []) if cls in all_classes]
if not available_classes:
    available_classes = all_classes

# --- Generate quizzes ---
NUM_OPTIONS = 4
quizzes = []
option_id_counter = 1000 

for q_idx in range(num_questions):
    target_class = random.choice(available_classes)
    target_images = os.listdir(os.path.join(DATASET_PATH, target_class))
    target_image = random.choice(target_images)

    # Pick wrong options
    other_classes = [c for c in all_classes if c != target_class]
    wrong_options = random.sample(other_classes, min(NUM_OPTIONS - 1, len(other_classes)))
    
    options_list = wrong_options + [target_class]
    random.shuffle(options_list)

    options_data = []
    correct_option_id = None  # We'll store the ID of the correct one here

    for opt_name in options_list:
        current_id = option_id_counter
        opt_images = os.listdir(os.path.join(DATASET_PATH, opt_name))
        
        # Check if this is the correct answer
        if opt_name == target_class:
            correct_option_id = current_id

        options_data.append({
            "id": current_id,
            "name": opt_name,
            "image": f"http://localhost:5000/images/{opt_name}/{random.choice(opt_images)}"
        })
        option_id_counter += 1

    quizzes.append({
        "id": q_idx + 1,
        "target": {
            "id": correct_option_id, # Matches the ID in the options list
            "name": target_class,
            "image": f"http://localhost:5000/images/{target_class}/{target_image}"
        },
        "options": options_data,
        "answer": target_class
    })

print(json.dumps(quizzes, indent=2))