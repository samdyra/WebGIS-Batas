# run_all_steps.py

from upload_spatial_data import main as upload_spatial_data_main
from create_layers import main as create_layers_main
from create_groups import main as create_groups_main

def main():
    print("Starting Step 1: Upload Spatial Data")
    upload_spatial_data_main()
    print("\nStarting Step 2: Create Layers from Spatial Data")
    create_layers_main()
    print("\nStarting Step 3: Create Groups and Assign Layers to Groups")
    create_groups_main()
    print("\nAll steps completed successfully.")

if __name__ == "__main__":
    main()
