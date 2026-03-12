import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import json
import os

# --- 1. SET PATHS ---
# This matches your ai-model/dataset/ structure
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TRAIN_DIR = os.path.join(BASE_DIR, "dataset/train")
VAL_DIR = os.path.join(BASE_DIR, "dataset/validation")

# --- 2. HYPERPARAMETERS ---
IMG_SIZE = (224, 224)
BATCH_SIZE = 16  # Good balance for CPU; decrease to 8 if computer freezes
EPOCHS = 20
LR = 0.0001

# --- 3. DATA AUGMENTATION ---
# This helps the model recognize objects even if they are tilted or zoomed
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,      # Rotate images (kids don't hold phones perfectly straight!)
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Validation data should only be rescaled (no augmentation)
val_datagen = ImageDataGenerator(rescale=1./255)

print("Loading images from folders...")
train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=True
)

val_generator = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

# --- 4. SAVE LABELS ---
# Creates a map like {0: "apple", 1: "banana"} for your Flask server
class_indices = train_generator.class_indices
labels = {int(v): k for k, v in class_indices.items()}
with open(os.path.join(BASE_DIR, "labels.json"), "w") as f:
    json.dump(labels, f, indent=4)
print(f"Labels saved: {list(labels.values())}")

# --- 5. BUILD MODEL (MobileNetV2) ---
# Use weights trained on ImageNet, but remove the top layer
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Keep the base "frozen" to save CPU time

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
x = Dropout(0.2)(x) # Prevents the model from "memorizing" specific photos
predictions = Dense(len(labels), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

model.compile(
    optimizer=Adam(learning_rate=LR),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# --- 6. SMART CALLBACKS ---
# EarlyStopping: Stops training if the model stops improving
early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
# ReduceLROnPlateau: Slows down learning rate if improvement stalls
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=2, min_lr=0.00001)

# --- 7. TRAINING ---
print(f"\nStarting training on {len(labels)} classes...")
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    callbacks=[early_stop, reduce_lr]
)

# --- 8. SAVE ---
model_path = os.path.join(BASE_DIR, "play2learn_model.h5")
model.save(model_path)
print(f"\n✅ Success! Model saved as {model_path}")