# Define variables
IMAGE_NAME = sisbatas-be
CONTAINER_NAME = my-sisbatas-container-be

# Build the Docker image
.PHONY: build
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
.PHONY: run
run:
	docker run -p 3001:3001 -d --env-file .env --name $(CONTAINER_NAME) $(IMAGE_NAME) 
