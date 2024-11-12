import requests
import re

# Configuration
API_BASE_URL = 'http://localhost:8080'
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE1MTA3MTIsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.olmxYoTBnr8c2QeI5nho7Po7KFcN3f097gKO6yc4JEM"  # Replace with your actual JWT token

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

def generate_layer_name(table_name):
    """
    Generates the layer name based on the table_name according to the specified rules.
    """
    print(f"Processing table name: '{table_name}'")
    
    # Replace multiple underscores with single
    name = re.sub('_+', '_', table_name)
    print(f"Name after cleaning underscores: '{name}'")
    
    # Split the table name using '_and_' to separate the two places
    if '_and_' in name:
        parts = name.split('_and_')
        place_names = []
        for part in parts:
            # Split the part into tokens
            tokens = part.split('_')
            if tokens[0].lower() in ['kabupaten', 'kota']:
                place_type = tokens[0].capitalize()
                place_name = ' '.join(token.capitalize() for token in tokens[1:])
            else:
                # Default to 'Kabupaten' if no place type marker is found
                place_type = 'Kabupaten'
                place_name = ' '.join(token.capitalize() for token in tokens)
            place_names.append((place_type, place_name))
    else:
        # Handle cases where '_and_' is not found
        # Assume the entire name is one place
        tokens = name.split('_')
        if tokens[0].lower() in ['kabupaten', 'kota']:
            place_type = tokens[0].capitalize()
            place_name = ' '.join(token.capitalize() for token in tokens[1:])
        else:
            place_type = 'Kabupaten'
            place_name = ' '.join(token.capitalize() for token in tokens)
        # Duplicate the place name to get two places
        place_names = [(place_type, place_name), (place_type, place_name)]
    
    # Build layer name
    place_str = ' dan '.join([f"{ptype} {pname}" for ptype, pname in place_names])
    layer_name = f"Delineasi Batas {place_str}"
    print(f"Generated layer name: '{layer_name}'\n")
    return layer_name


def create_layer(spatial_data_id, layer_name):
    """
    Creates a layer using the API.
    """
    url = f"{API_BASE_URL}/layers"
    data = {
        "spatial_data_id": spatial_data_id,
        "layer_name": layer_name,
        "coordinate": [0.0, 0.0],  # Placeholder; server will compute actual coordinate
        "color": "#FFBF00"  # Hex code for red
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
        table_name = spatial_data['table_name']
        if spatial_data.get('type') == 'LINESTRING':
            spatial_data_id = spatial_data['id']
            layer_name = generate_layer_name(table_name)
            if layer_name:
                create_layer(spatial_data_id, layer_name)

if __name__ == "__main__":
    main()
