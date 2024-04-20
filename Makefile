docker:
	docker build -t sec-docs .
	docker network create --driver=none no-internet
	docker run --network=no-internet --name=my-container -d sec-docs