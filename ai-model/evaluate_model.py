import os
import numpy as np
import tensorflow as tf
import json
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report

# =========================
# PATHS
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "play2learn_model.h5")
LABELS_PATH = os.path.join(BASE_DIR, "labels.json")
TEST_DIR = os.path.join(BASE_DIR, "dataset/validation")

OUTPUT_DIR = os.path.join(BASE_DIR, "evaluation_outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

IMG_SIZE = (224, 224)
BATCH_SIZE = 16

# =========================
# LOAD MODEL
# =========================
model = tf.keras.models.load_model(MODEL_PATH)
print("[INFO] Model loaded")

# =========================
# LOAD LABELS
# =========================
with open(LABELS_PATH, "r") as f:
    labels = json.load(f)

class_names = [labels[str(i)] for i in range(len(labels))]
print("[INFO] Classes:", class_names)

# =========================
# LOAD DATASET
# =========================
datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)

test_ds = datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    shuffle=False
)

# =========================
# PREDICTIONS
# =========================
y_true = test_ds.classes
y_probs = model.predict(test_ds, verbose=1)
y_pred = np.argmax(y_probs, axis=1)

# =========================
# CONFUSION MATRIX
# =========================
cm = confusion_matrix(y_true, y_pred)

print("\nClassification Report:\n")
print(classification_report(y_true, y_pred, target_names=class_names))

# =========================
# 1. CONFUSION MATRIX HEATMAP
# =========================
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=class_names,
            yticklabels=class_names)

plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("True")

plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "confusion_matrix.png"), dpi=300)
plt.close()
print("[INFO] Saved confusion_matrix.png")

# =========================
# 2. OVERALL MULTICLASS METRICS SUMMARY
# =========================
# Core per-class metrics calculated directly from the confusion matrix
tp_per_class = np.diag(cm)
fp_per_class = np.sum(cm, axis=0) - tp_per_class
fn_per_class = np.sum(cm, axis=1) - tp_per_class
tn_per_class = np.sum(cm) - (fp_per_class + fn_per_class + tp_per_class)

# Aggregated totals across all classes for the summary table
total_tp = int(np.sum(tp_per_class))
total_fp = int(np.sum(fp_per_class))
total_fn = int(np.sum(fn_per_class))
total_tn = int(np.sum(tn_per_class))

summary_data = [
    ["True Positives (TP)", total_tp],
    ["False Positives (FP)", total_fp],
    ["False Negatives (FN)", total_fn],
    ["True Negatives (TN)", total_tn]
]

plt.figure(figsize=(6, 3))
table = plt.table(cellText=summary_data,
                  colLabels=["Metric", "Overall Total"],
                  loc="center")

table.auto_set_font_size(False)
table.set_fontsize(11)
plt.axis("off")
plt.title("Overall Classification Summary", pad=10, fontweight="bold")

plt.savefig(os.path.join(OUTPUT_DIR, "tp_fp_fn_summary.png"), dpi=300)
plt.close()
print("[INFO] Saved tp_fp_fn_summary.png")

# =========================
# 3. PER CLASS ACCURACY
# =========================
class_accuracy = cm.diagonal() / cm.sum(axis=1)

plt.figure(figsize=(12, 6))
plt.bar(class_names, class_accuracy)

plt.xticks(rotation=45, ha="right")
plt.title("Per-Class Accuracy")
plt.ylabel("Accuracy")
plt.ylim(0, 1)

plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "per_class_accuracy.png"), dpi=300)
plt.close()
print("[INFO] Saved per_class_accuracy.png")

# =========================
# 4. FP vs FN PER CLASS
# =========================
x = np.arange(len(class_names))

plt.figure(figsize=(14, 6))

plt.bar(x - 0.2, fp_per_class, width=0.4, label="False Positives")
plt.bar(x + 0.2, fn_per_class, width=0.4, label="False Negatives")

plt.xticks(x, class_names, rotation=45, ha="right")
plt.title("False Positives vs False Negatives per Class")
plt.legend()

plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "fp_fn_per_class.png"), dpi=300)
plt.close()
print("[INFO] Saved fp_fn_per_class.png")

# =========================
# 5. 2x2 GRID OF PERFORMANCE METRICS PER CLASS
# =========================
fig, axes = plt.subplots(2, 2, figsize=(14, 12))

# Matrix grid mapping layout
metrics_config = [
    ("True Positives (TP) per Class", tp_per_class, "#2ecc71"),   # Green
    ("True Negatives (TN) per Class", tn_per_class, "#3498db"),   # Blue
    ("False Positives (FP) per Class", fp_per_class, "#e74c3c"),  # Red
    ("False Negatives (FN) per Class", fn_per_class, "#e67e22")   # Orange
]

for idx, (title, data, color) in enumerate(metrics_config):
    row = idx // 2
    col = idx % 2
    ax = axes[row, col]
    
    # Sort the data and labels in descending order for better visualization
    sorted_indices = np.argsort(data)[::-1]
    sorted_labels = [class_names[i] for i in sorted_indices]
    sorted_data = data[sorted_indices]
    
    # Draw bars
    ax.bar(sorted_labels, sorted_data, color=color, edgecolor='black', alpha=0.8)
    
    # Customizations
    ax.set_title(title, fontsize=13, fontweight='bold', pad=10)
    ax.set_ylabel("Count", fontsize=11)
    ax.set_xticks(range(len(sorted_labels)))
    ax.set_xticklabels(sorted_labels, rotation=45, ha="right", fontsize=9)
    ax.grid(axis='y', linestyle='--', alpha=0.5)

# Adjust spacing and export
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "metrics_2x2_grid.png"), dpi=300)
plt.close()
print("[INFO] Saved metrics_2x2_grid.png")

# =========================
# DONE
# =========================
print("\n✅ ALL EVALUATION FILES SAVED IN:", OUTPUT_DIR)