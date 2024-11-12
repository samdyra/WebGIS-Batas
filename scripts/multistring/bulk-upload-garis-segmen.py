import os
import requests

# Configuration
API_BASE_URL = "http://localhost:8080"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE1MTA3MTIsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.olmxYoTBnr8c2QeI5nho7Po7KFcN3f097gKO6yc4JEM"  # Replace with your actual JWT token
DIRECTORY = "/Users/dwiputrasam/Documents/data_project_jabar/garis_permen"  # Replace with the path to your .geojson files

def transform_table_name(filename):
    """
    Transforms the filename into the desired table name.
    Example: 'Tasikmalaya_-_Pangandaran.geojson' -> 'garis_tasikmalaya_pangandaran'
    """
    # Remove the '.geojson' extension
    name = os.path.splitext(filename)[0]
    # Replace '_-_' with '_'
    name = name.replace('_-_', '_')
    # Replace any remaining hyphens or underscores with underscores
    name = name.replace('-', '_').replace(' ', '_')
    # Add 'garis_' prefix
    table_name = f'garis_{name}'
    # Ensure the name doesn't start with a number
    if table_name and table_name[0].isdigit():
        table_name = '_' + table_name
    return table_name.lower()

def upload_file(file_path):
    """
    Uploads a single GeoJSON file to the API.
    """
    filename = os.path.basename(file_path)
    table_name = transform_table_name(filename)
    layer_name = os.path.splitext(filename)[0].replace('_', ' ').replace('-', ' ')
    url = f"{API_BASE_URL}/spatial-data"
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }
    data = {
        "table_name": table_name,
        "layer_name": layer_name,
        "type": "LINESTRING"
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
