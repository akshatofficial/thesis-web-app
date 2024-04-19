from PIL import Image

def get_image_size(input_image_path):
    # return the size of the image using the file path
    with Image.open(input_image_path) as img:
        return img.size

def resize_image(input_image_path, output_image_path, target_size=(64, 64)):
    # resize the image and save to the specified file path
    with Image.open(input_image_path) as img:
        # print(get_image_size(input_image_path=input_image_path))
        img = img.resize(size=target_size)
        # print(img.size)
        img.save(output_image_path)