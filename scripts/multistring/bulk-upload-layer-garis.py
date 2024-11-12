import requests

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
    # Remove 'garis_' prefix
    name = table_name[len('garis_'):]
    tokens = name.split('_')
    place_names = []
    i = 0
    while i < len(tokens):
        if tokens[i] == 'kota':
            if i + 1 < len(tokens):
                place_type = 'Kota'
                place_name = tokens[i + 1].capitalize()
                i += 2
            else:
                print(f"Unexpected end after 'kota' in table_name '{table_name}'.")
                break
        else:
            place_type = 'Kabupaten'
            place_name = tokens[i].capitalize()
            i += 1
        place_names.append((place_type, place_name))

    if len(place_names) == 2:
        layer_name = f"Delineasi Batas {place_names[0][0]} {place_names[0][1]} dan {place_names[1][0]} {place_names[1][1]}"
    else:
        # Handle cases where there are more or fewer than two place names
        layer_name = 'Delineasi Batas ' + ' dan '.join([f"{ptype} {pname}" for ptype, pname in place_names])
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
        "color": "#FF0000"  # Hex code for red
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
        if table_name.startswith('garis_') and spatial_data.get('type') == 'LINESTRING':
            spatial_data_id = spatial_data['id']
            layer_name = generate_layer_name(table_name)
            create_layer(spatial_data_id, layer_name)

if __name__ == "__main__":
    main()
