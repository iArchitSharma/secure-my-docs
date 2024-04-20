# Dockerfile
FROM node:18

RUN apt-get update && apt-get install -y libreoffice

VOLUME /data_volume

WORKDIR /app

# Copy JavaScript files
COPY . /app
RUN npm install

# Command to run the script
CMD ["node", "src/container1.js", "existing.xlsx"]

