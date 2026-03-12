import os
import shutil
import random

# --- CONFIGURATION ---
# Points to: ~/Desktop/projects/kids-game/ai-model/dataset
BASE_DATASET_DIR = os.path.expanduser("~/Desktop/projects/kids-game/ai-model/dataset")
RAW_DIR = os.path.join(BASE_DATASET_DIR, "raw")

# This handles the fruit path and checks two common names for the animal folder
SOURCE_PATHS = {
    "fruits": os.path.join(RAW_DIR, "fruits-360_100x100/fruits-360/Training"),
    "animals": os.path.join(RAW_DIR, "archive/raw-img") # If it's not 'raw-img', we check below
}

# The target folders you want
TRAIN_DIR = os.path.join(BASE_DATASET_DIR, "train")
VAL_DIR = os.path.join(BASE_DATASET_DIR, "validation")

ANIMAL_MAP = {"cane": "dog", "cavallo": "horse", "elefante": "elephant", "farfalla": "butterfly", "gallina": "chicken", "gatto": "cat", "mucca": "cow", "pecora": "sheep", "scoiattolo": "squirrel", "ragno": "spider"}
SELECTED_CLASSES = ["apple", "banana", "orange", "strawberry", "pineapple", "watermelon", "kiwi", "mango", "avocado", "pomegranate", "pear", "cherry", "grape", "lemon", "dog", "cat", "horse", "cow", "sheep", "chicken", "elephant", "squirrel", "butterfly"]

def prepare_clean_dataset(limit_per_class=300):
    # Reset train/val folders inside dataset/
    for d in [TRAIN_DIR, VAL_DIR]:
        if os.path.exists(d): shutil.rmtree(d)
        os.makedirs(d, exist_ok=True)

    for category, src_root in SOURCE_PATHS.items():
        # Fallback for animals if 'raw-img' isn't the right name
        if category == "animals" and not os.path.exists(src_root):
            potential_path = os.path.join(RAW_DIR, "archive/items") # Try the other one
            if os.path.exists(potential_path): src_root = potential_path

        if not os.path.exists(src_root):
            print(f"❌ Skipping {category}: {src_root} not found.")
            continue

        print(f"\n--- Processing {category.upper()} ---")
        for folder in os.listdir(src_root):
            folder_path = os.path.join(src_root, folder)
            if not os.path.isdir(folder_path): continue
            
            translated_name = ANIMAL_MAP.get(folder.lower(), folder.lower())
            match = next((c for c in SELECTED_CLASSES if c in translated_name), None)
            
            if match:
                t_dest, v_dest = os.path.join(TRAIN_DIR, match), os.path.join(VAL_DIR, match)
                os.makedirs(t_dest, exist_ok=True); os.makedirs(v_dest, exist_ok=True)

                if len(os.listdir(t_dest)) >= limit_per_class: continue

                images = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
                random.shuffle(images)
                
                num = min(len(images), 100) 
                split = int(num * 0.8)
                
                for img in images[:split]:
                    shutil.copy(os.path.join(folder_path, img), os.path.join(t_dest, f"{folder}_{img}"))
                for img in images[split:num]:
                    shutil.copy(os.path.join(folder_path, img), os.path.join(v_dest, f"{folder}_{img}"))
                print(f"✅ Added variety for: {match}")

    print(f"\n🎉 Clean structure ready at: {BASE_DATASET_DIR}")

if __name__ == "__main__":
    prepare_clean_dataset()