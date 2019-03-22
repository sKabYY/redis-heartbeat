DOCKER_IMAGE=redis/redis-heartbeat

all: image

zip:
	zip -r redis-heartbeat.zip node_modules static heartbeat.js prom2json startup.sh

image: zip
	docker build -t $(DOCKER_IMAGE) .

push:
	@./tag-and-push.sh $(DOCKER_IMAGE) ddd/redis-heartbeat