#!/bin/bash

# Log in once at the start
docker login -u bharanichandra

# Build and Push each service
# Note: Ensure these folder names match yours exactly!
docker build -t bharanichandra/library-add-service:latest ./service-add
docker push bharanichandra/library-add-service:latest

docker build -t bharanichandra/library-view-service:latest ./service-view
docker push bharanichandra/library-view-service:latest

docker build -t bharanichandra/library-delete-service:latest ./service-delete
docker push bharanichandra/library-delete-service:latest

# Building from the correct local folder name
docker build -t bharanichandra/library-transaction-service:latest ./service-issue-return
docker push bharanichandra/library-transaction-service:latest

docker build -t bharanichandra/library-frontend:latest ./library-frontend
docker push bharanichandra/library-frontend:latest