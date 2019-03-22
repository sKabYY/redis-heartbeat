FROM node:11-alpine
MAINTAINER skabyy

RUN echo "http://mirrors.aliyun.com/alpine/v3.8/main" > /etc/apk/repositories \
    && echo "http://mirrors.aliyun.com/alpine/v3.8/community" >> /etc/apk/repositories \
    && apk update upgrade \
    && apk add --no-cache procps unzip curl bash tzdata libc6-compat \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone

ADD redis-heartbeat.zip /redis-heartbeat/redis-heartbeat.zip
RUN unzip /redis-heartbeat/redis-heartbeat.zip -d /redis-heartbeat \
    && rm -rf /redis-heartbeat/redis-heartbeat.zip \
    && chmod +x /redis-heartbeat/prom2json

WORKDIR /redis-heartbeat

ENTRYPOINT ["/redis-heartbeat/startup.sh"]

EXPOSE 2333