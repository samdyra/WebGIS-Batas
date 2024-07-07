# Define variables
IMAGE_NAME = sisbatas-fe
CONTAINER_NAME = my-sisbatas-container

# Build the Docker image
.PHONY: build
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
.PHONY: run
run:
	docker run -p 3000:3000 --env-file .env --name $(CONTAINER_NAME) $(IMAGE_NAME)
