# Define variables
COMPOSE_FILE = docker-compose.yml
CLIENT_IMAGE_NAME = dwiputrasam/sisbatas-client
SERVER_IMAGE_NAME = dwiputrasam/sisbatas-server
DATABASE_IMAGE_NAME = dwiputrasam/sisbatas-database

# Run Locally
.PHONY: local
local:
	@echo "Run Database"
	docker-compose -f $(COMPOSE_FILE) up -d database
	@sh ./run-local.sh

# Build the Docker images
.PHONY: build
build:
	@echo "Building Docker images..."
	docker-compose -f $(COMPOSE_FILE) build

# Run the Docker containers
.PHONY: up
up:
	@echo "Starting Docker containers..."
	docker-compose -f $(COMPOSE_FILE) up -d

# Stop the Docker containers
.PHONY: down
down:
	@echo "Stopping Docker containers..."
	docker-compose -f $(COMPOSE_FILE) down

# Rebuild the Docker images
.PHONY: rebuild
rebuild: down build up

# Rebuild server image
.PHONY: rebuild-server
rebuild-server:
	@echo "Rebuilding server image..."
	docker-compose -f $(COMPOSE_FILE) down server
	docker-compose -f $(COMPOSE_FILE) build server
	docker-compose -f $(COMPOSE_FILE) up -d server

# View Docker Compose logs
.PHONY: logs
logs:
	@echo "Viewing logs..."
	docker-compose -f $(COMPOSE_FILE) logs -f

# Clean up Docker resources
.PHONY: clean
clean:
	@echo "Cleaning up Docker resources..."
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans
	docker system prune -f
	docker volume prune -f

# Remove images
.PHONY: rmi
rmi:
	@echo "Removing Docker images..."
	docker rmi $(CLIENT_IMAGE_NAME) $(SERVER_IMAGE_NAME) $(DATABASE_IMAGE_NAME)

# Initialize the database
.PHONY: initdb
initdb:
	@echo "Initializing database..."
	docker-compose -f $(COMPOSE_FILE) up -d database
	sleep 10
	docker exec -i $(DATABASE_CONTAINER_NAME) psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/init_schema.sql
	docker exec -i $(DATABASE_CONTAINER_NAME) psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/seed_data.sql
	docker-compose -f $(COMPOSE_FILE) down

# Start only the database service
.PHONY: up-database
up-database:
	@echo "Starting only the database service..."
	docker-compose -f $(COMPOSE_FILE) up -d database

# Restart the Docker containers
.PHONY: restart
restart: down up
