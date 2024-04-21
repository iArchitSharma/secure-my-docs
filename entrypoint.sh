#!/bin/bash
# Check if FILE_PATH is set
if [ -z "$FILE_PATH" ]; then
  echo "ERROR: FILE_PATH environment variable is not set."
  exit 1
fi

# Wait for the specified file to be copied
while [ ! -f "$FILE_PATH" ]; do
  echo "Waiting for $FILE_PATH..."
  sleep 1
done

echo "$FILE_PATH found! Running script..."
node src/index.js "$FILE_PATH"
