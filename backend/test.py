from gradio_client import Client, file

client = Client("https://7395458a587bc50ec3.gradio.live/")
result = client.predict(
		file('https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png'),	# filepath in 'cloth_image' Image component
		file('https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png'),	# filepath in 'origin_image' Image component
		api_name="/predict"
)
print(result)