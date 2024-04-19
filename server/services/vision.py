from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
import pickle

def load_trained_model(selected_model):
    model = ""
    if selected_model == "resNet50V2":
        model = load_model("models/ResNet50V2_eurosat.h5")
    elif selected_model == "resNet50":
        model = load_model("models/ResNet50_eurosat.h5")
    elif selected_model == "resNet152V2":
        model = load_model("models/ResNet152V2_eurosat.h5")
    elif selected_model == "vgg16":
        model = load_model("models/vgg16_eurosat.h5")
    elif selected_model == "vgg19":
        model = load_model("models/vgg19_eurosat.h5")
    elif selected_model == "random_forest":
        with open('models/rf_classifier_model.pkl', 'rb') as f:
            model = pickle.load(f)
    return model

def make_prediction(input_image_path, trained_model, model_type=""):
    img = image.load_img(input_image_path, target_size=(64, 64))
    img_array = image.img_to_array(img)

    # Rescale the image
    img_array /= 255.0

    if model_type == "ML":
        flattened_img = img_array.flatten().reshape(1, -1)
        pred = trained_model.predict(flattened_img)
        return [], pred.tolist()
    
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    preds = trained_model.predict(img_array)
    pred_class = preds.argmax(axis=-1)
    return preds.tolist(), pred_class.tolist()
