#!/bin/sh

if [ "$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9001/echo)" = "200" ]; then
   echo rapido-backend is healthy
else
   echo Error pinging rapido-backend
   exit 1;
fi
