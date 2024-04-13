# Makefile for Docker image management

# Default Docker image name
IMAGE_NAME := progapandist/presail-demo

# Default image version/tag. Override by passing VERSION=mytag make build or make build-prod
VERSION ?= latest

# Specify the Dockerfile for development and production
DOCKERFILE_DEV := Dockerfile
DOCKERFILE_PROD := Dockerfile.prod

.PHONY: build build-prod push

# Build the Docker image with a default or custom tag for development
build:
	docker build -f $(DOCKERFILE_DEV) -t $(IMAGE_NAME):$(VERSION) .

# Build the Docker image for production with a custom tag
build-prod:
	docker build -f $(DOCKERFILE_PROD) -t $(IMAGE_NAME):$(VERSION) .

# Push the Docker image to Docker Hub
push:
	docker push $(IMAGE_NAME):$(VERSION)

prod-console:
	kamal app exec 'bin/rails c' -i --reuse
