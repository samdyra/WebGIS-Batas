import os
import requests

# Configuration
API_BASE_URL = "http://localhost:8080"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE4MzI2ODgsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.lzyhS0wuNmTr0QUJPsV4w6V-zcegPluJtt5GpHJyElY"  # Replace with your actual JWT token
DIRECTORY = "/Users/dwiputrasam/Documents/data_project_jabar/permen_geojson"  # Replace with the path to your .geojson files

def sanitize_table_name(filename):
    """
    Sanitize the filename to create a valid table name.
    """
    # Replace forward slashes and spaces with underscores
    name = filename.replace("/", "_").replace(" ", "_")
    # Remove file extension
    name = os.path.splitext(name)[0]
    # Replace special characters with underscores
    name = ''.join(c if c.isalnum() or c == '_' else '_' for c in name)
    # Ensure the name doesn't start with a number
    if name and name[0].isdigit():
        name = '_' + name
    return name.lower()

def upload_file(file_path):
    """
    Upload a single file to the API.
    """
    filename = os.path.basename(file_path)
    table_name = sanitize_table_name(filename)
    url = f"{API_BASE_URL}/spatial-data"
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }
    data = {
        "table_name": table_name,
        "type": "POINT"
    }
    files = {
        "file": (filename, open(file_path, 'rb'), 'application/octet-stream')
    }
    response = requests.post(url, headers=headers, data=data, files=files)
    if response.status_code == 201:
        print(f"Successfully uploaded '{filename}' as table '{table_name}'.")
    elif response.status_code == 409:
        print(f"Table '{table_name}' already exists. Skipping '{filename}'.")
    else:
        print(f"Failed to upload '{filename}'. Status Code: {response.status_code}, Response: {response.text}")

def main():
    # Ensure the directory exists
    if not os.path.isdir(DIRECTORY):
        print(f"The directory '{DIRECTORY}' does not exist.")
        exit(1)

    # Iterate over all .geojson files in the directory
    for filename in os.listdir(DIRECTORY):
        if filename.endswith(".geojson"):
            file_path = os.path.join(DIRECTORY, filename)
            upload_file(file_path)

if __name__ == "__main__":
    main()
