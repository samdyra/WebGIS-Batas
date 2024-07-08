# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Install the PostGIS extension
RUN apt-get update && apt-get install -y postgis postgresql-13-postgis-3

# Copy the initialization scripts
COPY init_schema.sql /docker-entrypoint-initdb.d/
COPY seed_data.sql /docker-entrypoint-initdb.d/

# Add a script to create the PostGIS extension
COPY create_postgis_extension.sh /docker-entrypoint-initdb.d/

# Ensure the init scripts are executable
RUN chmod +x /docker-entrypoint-initdb.d/create_postgis_extension.sh
