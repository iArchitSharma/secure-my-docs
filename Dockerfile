# Dockerfile
FROM node:18

RUN apt-get update && apt-get install -y libreoffice

VOLUME /data_volume

WORKDIR /app

# Copy JavaScript files
COPY . /app
RUN npm install

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

