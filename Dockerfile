# Dockerfile
FROM node:18

RUN apt-get update && apt-get install -y libreoffice

VOLUME /data_volume

WORKDIR /app

# Copy JavaScript files
COPY src/package.json /app/package.json
RUN npm install
COPY . /app

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

