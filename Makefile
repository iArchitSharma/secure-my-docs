docker:
	docker build -t sec-docs .
	docker run --rm --network none -d sec-docs