from flask import Flask, request, jsonify
import os
import shutil
from gradio_client import Client, file
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app) 
# Initialize the Gradio client

def download_image(image_url):
	image_url = image_url.strip()

	# Name of the file to save the image as, with a .png extension
	filename = "downloaded_image.png"

	# Ensure the uploads directory exists
	if not os.path.exists("uploads"):
		os.makedirs("uploads")

	# Full path to the file
	file_path = os.path.join("uploads", filename)

	# Make the request to download the image
	response = requests.get(image_url, stream=True)

	# Check if the request was successful
	if response.status_code == 200:
		# Open the file in write mode and write the content
		with open(file_path, 'wb') as file:
			for chunk in response.iter_content(chunk_size=128):
				file.write(chunk)
		print(f"Image downloaded successfully and saved as {file_path}")
	else:
		print(f"Failed to download image. Status code: {response.status_code}")


#try on
client = Client("https://7395458a587bc50ec3.gradio.live/")

#chatBot
gradio_client = Client("https://fe81ff40040ecfff3c.gradio.live/")

#dress
dress = Client("dhaan-ish/text-to-cloth")

#ocassion

ocassion_client = Client("https://8c8e6f96c1fe2aefb7.gradio.live/")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        
        data = request.get_json()
        text_input = data["text"]
        print(text_input)
       

        result = gradio_client.predict(
		text_input,	# str  in 'text' Textbox component
		api_name="/predict"
        )
        print("Hello")
        print(result)
        print(result,"qr")
        return jsonify({"result": result})
        return jsonify({'result': "mskdjg"})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/uploadocassion', methods=['POST'])
def upload_ocassion():
    # Check if the request contains a file
    print(request.files)
    if 'uploadedFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    uploaded_file = request.files['uploadedFile']
    url = request.form['url']
    download_image(url)
    print(url)
    if uploaded_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if uploaded_file:
        # Save the uploaded file
        uploaded_file.save(os.path.join('uploads', 'upload.png'))
        # Save the fetched file if it exists
        
        print("yes")
        # Use the Gradio client to make a prediction
        result = client.predict(
            file("uploads/downloaded_image.png"), # filepath in 'cloth_image' Image component
            file("uploads/upload.png"), # filepath in 'origin_image' Image component
            api_name="/predict"
        )
        print(result)
        result_image_path = result
        print(result_image_path)
        destination_dir = 'D:/sastra/sastra_hack/public'
        
        shutil.copy(result_image_path, destination_dir)
        
        return jsonify({'message': 'Result image copied successfully.'}), 200

@app.route('/upload', methods=['POST'])
def upload_files():
    print(request.files)
    if 'uploadedFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    uploaded_file = request.files['uploadedFile']
    if uploaded_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if uploaded_file:
        # Save the uploaded file
        uploaded_file.save(os.path.join('uploads', 'upload.png'))
        # Save the fetched file if it exists
        
        print("yes")
        # Use the Gradio client to make a prediction
        result = client.predict(
            file(r"D:\sastra\sastra_hack\public\image.JPEG"), # filepath in 'cloth_image' Image component
            file("uploads/upload.png"), # filepath in 'origin_image' Image component
            api_name="/predict"
        )
        result_image_path = result
        print(result_image_path)
        destination_dir = 'D:/sastra/sastra_hack/public'
        
        shutil.copy(result_image_path, destination_dir)
        
        return jsonify({'message': 'Result image copied successfully.'}), 200
    
@app.route('/handleprompt', methods=['POST'])
def handle_prompt():
    data = request.get_json()
    prompt = data.get('prompt')
    print(prompt)
    result = dress.predict(
		prompt,
		api_name="/predict"
    )
    image_path = result
    print(image_path)
    dress_dir = 'D:/sastra/sastra_hack/public'
    
    shutil.copy(image_path, dress_dir)
    print("done")
    return jsonify({'message':'Success'}),200

@app.route('/handleocassion', methods=['POST'])
def handleocassion():
    # Extract data from the request
    data = request.json
    color = data.get('color')
    selected_occasion = data.get('selectedOccasion')
    print(color, selected_occasion)
    # Make the prediction
    result = ocassion_client.predict(
        f"{color} shirt for {selected_occasion}",
        api_name="/predict"
    )

    # Process the result
    new_items = result.split(",")

    # Return the result as JSON
    return jsonify({
        'newItems': new_items,
        'showRecommendations': True
    })

if __name__ == '__main__':
    app.run(debug=True)
