FROM node:boron

ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build
RUN chmod +x /health_check.sh

HEALTHCHECK --interval=15s --timeout=5s --retries=10 CMD /health_check.sh || exit 1

EXPOSE 9001
CMD [ "npm", "start" ]
