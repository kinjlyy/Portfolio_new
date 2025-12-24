from PIL import Image
import sys

def remove_white_bg(input_path, output_path, threshold=200):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if pixel is close to white (R>threshold, G>threshold, B>threshold)
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                newData.append((255, 255, 255, 0)) # Make it transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Successfully removed white background")
    except Exception as e:
        print(f"Error: {e}")

remove_white_bg("assets/chatbot-logo.png", "assets/chatbot-logo-clean.png")
