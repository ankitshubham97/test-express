# README: test-express

# Introduction

This README provides steps on how to ensure that the server on which the backend will be deployed is ready. The idea is that we will try to run a dummy backend (an http service) on your server. If it runs, we can safely assume that the actual backend would run as well!

# Prerequisites

## Docker

Please ensure docker is installed at your server. You can get it from [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/). You should be able to invoke docker at your server using docker --version

```bash
% docker --version
Docker version 20.10.22, build 3a2c30b
```

# How to run

Go to test-express directory

You would find a Dockerfile. It basically spins up a NodeJS container and runs the backend within it.

Create an image using `docker build . -t ankitshubham97/test-express`

Verify the image is created using `docker images`

```bash
% docker images
REPOSITORY                                                        TAG       IMAGE ID       CREATED         SIZE
ankitshubham97/test-express                                       latest    ff1be8bc04a9   5 seconds ago   1.01GB
```

Run the image using `docker run -p 3001:3000 -d ankitshubham97/test-express`. Note that this assumes that at your server, you have exposed port 3001 to be accessible via internet. (App is running at port 3000 within the docker container and is configured in the Dockerfile).

```bash
% docker run -p 3001:3000 -d ankitshubham97/test-express
3f988563647e9654d630040c739f618c571087fa3701eac03a2cf5a07077826c
```

Check if the container is up and running using `docker ps`

```bash
% docker ps
CONTAINER ID   IMAGE                         COMMAND                  CREATED          STATUS          PORTS                    NAMES
3ab3c02439e5   ankitshubham97/test-express   "docker-entrypoint.s…"   12 minutes ago   Up 12 minutes   0.0.0.0:3001->3000/tcp   hopeful_perlman
```

# Verify backend is running and accessible

Suppose the server endpoint url where the backend is supposed to be running is `https://example.com`. Then at https://example.com/checks, you should get a response ‘Backend is up and running!!’. 

![backend_up](https://user-images.githubusercontent.com/16755676/228033055-e0948440-ccc9-4c71-95ed-53be4bc40de4.png)
