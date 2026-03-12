import os
import zipfile
import shutil

RAW_DIR = "dataset/raw"  # folder with all zip files
DATASET_DIR = "dataset"  # your main dataset folder

for zip_name in os.listdir(RAW_DIR):
    if not zip_name.endswith(".zip"):
        continue

    zip_path = os.path.join(RAW_DIR, zip_name)
    temp_extract = os.path.join(RAW_DIR, zip_name.replace(".zip", "_temp"))

    # Extract zip
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(temp_extract)

    # Merge into train and validation
    for split in ["train", "validation"]:
        src_split = os.path.join(temp_extract, split)
        dest_split = os.path.join(DATASET_DIR, split)
        if not os.path.exists(src_split):
            continue

        for class_name in os.listdir(src_split):
            src_class = os.path.join(src_split, class_name)
            dest_class = os.path.join(dest_split, class_name)

            if not os.path.isdir(src_class):
                continue  # skip files

            os.makedirs(dest_class, exist_ok=True)

            for file_name in os.listdir(src_class):
                src_file = os.path.join(src_class, file_name)
                dest_file = os.path.join(dest_class, file_name)
                if not os.path.exists(dest_file):
                    shutil.copy(src_file, dest_file)

    print(f"Merged {zip_name} successfully!")
