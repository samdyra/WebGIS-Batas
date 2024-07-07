# Define variables
IMAGE_NAME = sisbatas-fe

# Build the Docker image
.PHONY: build
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
.PHONY: run
run:
	docker run -p 3000:3000 --env-file .env $(IMAGE_NAME)
