import tensorflow as tf
from keras import layers, models
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import cv2
import numpy as np
import os

# Define the emotions
EMOTIONS = ["neutral", "happy", "surprise", "sad", "angry", "disgust", "fear", "contempt", "unknown", "NF"]

# Load your dataset
def load_dataset(data_dir):
    images = []
    labels = []
    
    for label, emotion in enumerate(EMOTIONS):
        emotion_dir = os.path.join(data_dir, emotion)
        for img_name in os.listdir(emotion_dir):
            img_path = os.path.join(emotion_dir, img_name)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)  # Load image as grayscale
            img = cv2.resize(img, (48, 48))  # Resize to 48x48 pixels
            images.append(img)
            labels.append(label)
    
    return np.array(images), np.array(labels)

# Preprocess images and labels
def preprocess_data(images, labels):
    images = images / 255.0  # Normalize images
    images = np.expand_dims(images, axis=-1)  # Add channel dimension
    labels = tf.keras.utils.to_categorical(labels, len(EMOTIONS))  # One-hot encode labels
    return images, labels

# Build the CNN model
def create_model():
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(48, 48, 1)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dense(len(EMOTIONS), activation='softmax')  # Output layer with softmax for classification
    ])
    
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

# Plot training history
def plot_history(history):
    plt.plot(history.history['accuracy'], label='accuracy')
    plt.plot(history.history['val_accuracy'], label='val_accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.show()

# Main
data_dir = "./data"  # Replace with your dataset path

# Load and preprocess the dataset
images, labels = load_dataset(data_dir)
images, labels = preprocess_data(images, labels)

# Split the dataset into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(images, labels, test_size=0.2, random_state=42)

# Create and train the model
model = create_model()
history = model.fit(X_train, y_train, epochs=25, validation_data=(X_val, y_val))

# Plot training results
plot_history(history)

# Save the model
model.save('emotion_detection_model.h5')
