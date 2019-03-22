#!/bin/sh

node heartbeat.js $* || (echo 'Go to shell' && /bin/sh)