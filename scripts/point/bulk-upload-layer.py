import requests

# Configuration
API_BASE_URL = 'http://localhost:8080'
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE0MzcwODYsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.x_A0PbqrkRM2mNvos97aa7pfPfVAJBodSYC0JmIojqM"

headers = {'Authorization': f'Bearer {TOKEN}'}

def get_spatial_data():
    """
    Fetches the list of spatial data from the API.
    """
    url = f"{API_BASE_URL}/spatial-data"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get spatial data. Status Code: {response.status_code}, Response: {response.text}")
        exit(1)

def format_layer_name(table_name):
    """
    Formats the table_name into a human-readable layer_name.
    """
    # Replace '___' with ' dan '
    name = table_name.replace('___', ' dan ')
    # Replace '_' with ' '
    name = name.replace('_', ' ')
    # Remove extra spaces
    name = ' '.join(name.split())
    # Capitalize each word
    name = name.title()
    return name

def create_layer(spatial_data_id, layer_name):
    """
    Creates a layer using the API.
    """
    url = f"{API_BASE_URL}/layers"
    data = {
        "spatial_data_id": spatial_data_id,
        "layer_name": layer_name,
        "coordinate": [0.0, 0.0],  # Placeholder; server will compute actual coordinate
        "color": "yellow"
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 201:
        print(f"Successfully created layer '{layer_name}'")
    elif response.status_code == 409:
        print(f"Layer '{layer_name}' already exists. Skipping.")
    else:
        print(f"Failed to create layer '{layer_name}'. Status Code: {response.status_code}, Response: {response.text}")

def main():
    spatial_data_list = get_spatial_data()
    for spatial_data in spatial_data_list:
        if spatial_data.get('type') == 'POINT':
            spatial_data_id = spatial_data['id']
            table_name = spatial_data['table_name']
            layer_name = format_layer_name(table_name)
            create_layer(spatial_data_id, layer_name)

if __name__ == "__main__":
    main()
