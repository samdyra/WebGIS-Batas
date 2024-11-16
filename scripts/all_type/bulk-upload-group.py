import requests
import re

# Configuration
API_BASE_URL = 'http://localhost:8080'
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE4MzI2ODgsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.lzyhS0wuNmTr0QUJPsV4w6V-zcegPluJtt5GpHJyElY"

headers = {'Authorization': f'Bearer {TOKEN}'}

def fetch_layers():
    """
    Fetches all layers from the API.
    """
    url = f"{API_BASE_URL}/layers?id=*"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch layers. Status Code: {response.status_code}, Response: {response.text}")
        exit(1)

def extract_kabupaten_kota(layer_name):
    """
    Extracts kabupaten/kota names from the layer name.
    """
    # Use regex to find all 'Kabupaten X' or 'Kota Y' occurrences up to ' Dan' or end of string
    pattern = r'(Kabupaten\s+[A-Za-z\s]+?|Kota\s+[A-Za-z\s]+?)(?=\s+Dan|$)'
    matches = re.findall(pattern, layer_name, re.IGNORECASE)
    # Clean up and standardize the names
    names = [match.strip().title() for match in matches]
    return names

def create_group(group_name):
    """
    Creates a group with the given name.
    """
    url = f"{API_BASE_URL}/layer-groups"
    data = {
        "group_name": group_name
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 201:
        print(f"Group '{group_name}' created successfully.")
        return True
    elif response.status_code == 409:
        print(f"Group '{group_name}' already exists.")
        return True
    else:
        print(f"Failed to create group '{group_name}'. Status Code: {response.status_code}, Response: {response.text}")
        return False

def get_groups():
    """
    Fetches all existing groups.
    """
    url = f"{API_BASE_URL}/layer-groups"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        groups = response.json()
        if not groups:
            groups = []
        # Create a mapping of group names to IDs
        group_dict = {group['group_name']: group['group_id'] for group in groups}
        return group_dict
    else:
        print(f"Failed to fetch groups. Status Code: {response.status_code}, Response: {response.text}")
        exit(1)

def add_layer_to_group(layer_id, group_id):
    """
    Adds a layer to a group.
    """
    url = f"{API_BASE_URL}/layer-groups/add-layer"
    data = {
        "layer_id": layer_id,
        "group_id": group_id
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        print(f"Layer {layer_id} added to group {group_id} successfully.")
    elif response.status_code == 409:
        print(f"Layer {layer_id} is already in group {group_id}.")
    else:
        print(f"Failed to add layer {layer_id} to group {group_id}. Status Code: {response.status_code}, Response: {response.text}")

def main():
    layers = fetch_layers()
    existing_groups = get_groups()
    all_group_names = set(existing_groups.keys())

    for layer in layers:
        layer_id = layer['id']
        layer_name = layer['layer_name']
        kabupaten_kota_names = extract_kabupaten_kota(layer_name)

        for name in kabupaten_kota_names:
            if name not in all_group_names:
                # Create the group
                success = create_group(name)
                if success:
                    # Refresh the groups list
                    existing_groups = get_groups()
                    all_group_names = set(existing_groups.keys())
            group_id = existing_groups.get(name)
            if group_id:
                add_layer_to_group(layer_id, group_id)
            else:
                print(f"Group '{name}' not found after creation.")

if __name__ == "__main__":
    main()
