#!/bin/bash

# Set MinIO root credentials
MINIO_ROOT_USER="admin"
MINIO_ROOT_PASSWORD="strongpassword"

# Run MinIO
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=$MINIO_ROOT_USER" \
  -e "MINIO_ROOT_PASSWORD=$MINIO_ROOT_PASSWORD" \
  -v "$(pwd)/minio-data:/data" \
  minio/minio server /data --console-address ":9001"

echo "MinIO server started. Access the console at http://localhost:9001"
echo "API is available at http://localhost:9000"
echo "Login with Root User: $MINIO_ROOT_USER and the password you set"