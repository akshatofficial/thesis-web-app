import os
from flask import Flask, request, json
from flask_cors import CORS, cross_origin
from services.vision import load_trained_model, make_prediction
from werkzeug.utils import secure_filename
from utils.image import resize_image, get_image_size

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = "content-type"


@app.route("/health", methods=['GET'])
def apiHealth():
    if request.method == "GET":
        return "API is up and running."


@app.route("/predict", methods=["POST"])
@cross_origin()
def predictImageLabel():
    if request.method == "POST":
        image = request.files['image']
        selected_model_for_prediction = request.form["selected_model"]
        model = load_trained_model(selected_model_for_prediction)

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(image.filename))
        image.save(file_path)

        # resizing the image to (64, 64) as we used this size only for the training and inferencing
        file_name, extension = os.path.splitext(file_path)
        new_file_name = f"{file_name}_resized{extension}"
        new_file_path = os.path.join(os.path.dirname(file_path), new_file_name)
        resize_image(input_image_path=file_path, output_image_path=new_file_path)

        # making predictions using the resized image
        model_type = "ML" if selected_model_for_prediction == "random_forest" else "DL"
        preds, pred_class = make_prediction(new_file_path, model, model_type)
        print(preds)
        return json.dumps({
            "predicted_class": pred_class,
            "prediction_probabilities": preds
        })


if __name__ == "main":
    app.run(debug=True, port=5000)
