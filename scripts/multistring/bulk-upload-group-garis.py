import requests

# Configuration
API_BASE_URL = "http://localhost:5000"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzIwMDc1NzUsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoic2FtZHlyYSJ9.r6sOMLj7B_TspBKHuWR4CWEvC-vWJnaCbS29982-XIk"

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
    Extracts Kabupaten/Kota names from the layer name.
    """
    # Remove 'Delineasi Batas ' prefix
    prefix = 'Delineasi Batas '
    if layer_name.startswith(prefix):
        rest = layer_name[len(prefix):]
    else:
        rest = layer_name

    # Split by ' dan ' to get individual places
    places = rest.split(' dan ')
    names = []
    for place in places:
        place = place.strip()
        if place.startswith('Kabupaten ') or place.startswith('Kota '):
            names.append(place)
        else:
            # Handle cases where 'Kabupaten' or 'Kota' might be missing
            # Assume missing 'Kabupaten' or 'Kota' prefix means it's 'Kabupaten'
            place_name = 'Kabupaten ' + place
            names.append(place_name)
    return names

def create_group(group_name):
    """
    Creates a group with the given name and returns its ID.
    """
    # First, try to get the group ID if it already exists
    group_id = get_group_id_by_name(group_name)
    if group_id:
        print(f"Group '{group_name}' already exists.")
        return group_id

    # If not, create the group
    url = f"{API_BASE_URL}/layer-groups"
    data = {
        "group_name": group_name
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 201:
        print(f"Group '{group_name}' created successfully.")
        # Fetch the group ID after creation
        group_id = get_group_id_by_name(group_name)
        return group_id
    elif response.status_code == 409:
        print(f"Group '{group_name}' already exists (received 409).")
        group_id = get_group_id_by_name(group_name)
        return group_id
    else:
        print(f"Failed to create group '{group_name}'. Status Code: {response.status_code}, Response: {response.text}")
        return None

def get_groups():
    """
    Fetches all existing groups.
    """
    url = f"{API_BASE_URL}/layer-groups"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        groups = response.json() or []
        # Create a mapping of group names to IDs, normalize names to lower case
        group_dict = {group['group_name'].strip().lower(): group['group_id'] for group in groups}
        return group_dict
    else:
        print(f"Failed to fetch groups. Status Code: {response.status_code}, Response: {response.text}")
        exit(1)

def get_group_id_by_name(group_name):
    """
    Retrieves a group's ID by its name.
    """
    url = f"{API_BASE_URL}/layer-groups?group_name={group_name}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        groups = response.json()
        for group in groups:
            if group['group_name'] == group_name:
                return group['group_id']
        return None
    else:
        print(f"Failed to fetch group '{group_name}'. Status Code: {response.status_code}, Response: {response.text}")
        return None

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

    for layer in layers:
        layer_id = layer['id']
        layer_name = layer['layer_name']

        # Process only layers that start with 'Delineasi Batas'
        if not layer_name.startswith('Delineasi Batas'):
            continue

        kabupaten_kota_names = extract_kabupaten_kota(layer_name)

        for name in kabupaten_kota_names:
            normalized_name = name.strip().lower()
            group_id = existing_groups.get(normalized_name)
            if not group_id:
                # Create the group
                group_id = create_group(name.strip())
                if group_id:
                    existing_groups[normalized_name] = group_id  # Update existing groups
                else:
                    print(f"Failed to get or create group '{name}' for layer '{layer_name}'.")
                    continue
            add_layer_to_group(layer_id, group_id)

if __name__ == "__main__":
    main()
