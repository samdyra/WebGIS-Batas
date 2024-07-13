# used in root level Makefile
#!/bin/sh
# Start the server
echo "Run Server"
cd server && npm install && npm run start &
SERVER_PID=$!

# Start the client
echo "Run Client"
cd client && npm install && npm run dev &
CLIENT_PID=$!

# Trap the exit signal to ensure cleanup
trap "kill $SERVER_PID $CLIENT_PID" EXIT

# Wait for both processes to finish
wait $SERVER_PID
wait $CLIENT_PID
