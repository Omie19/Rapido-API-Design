# rapido
A project for graphically designing restful apis.

[rapido-instance](rapido-instance) : is a nodejs http server serves api and SPA written in react required for the Sketching etc

[rapido-db](rapido-db) : is just a docker container for postgres database, with rapido schemas, which can be leveraged for persistence.

## Build the application
If you just wish to run the application from already built containers located at <b>isl-dsdc.ca.com:5000/apim-solutions</b>, skip to [Run the application](#run-the-application)


Prerequisite :
1. docker
2. docker compose

Usage :
``` sh
./build.sh <project-name>|all [deploy]
```

Examples :
``` sh
./build.sh rapido-db
./build.sh rapido-instance push
./build.sh all
./build.sh all push
```

The above command builds one or more docker container and pushes (if supplied as argument) them to docker registry

<b>isl-dsdc.ca.com:5000/apim-solutions</b>

## Run the application
Rapido is docker containerized application. Current development is already staged at <b>isl-dsdc.ca.com:5000/apim-solutions</b>. In order to run, you could either build all the containers as mentioned in the above section or you could download them from stage repository.

### Locally built containers
Since, you have built the containers, you could just run them using docker compose file [docker-compose-local.yml](docker-compose-local.yml)
Alternatively ( read: easy way ),

``` sh
./run.sh local
```
### From staged containers
If you don't want to get into the bread and potatoes of the container building. You could just pull the images using [docker-compose-local.yml](docker-compose-local.yml) and run.
Alternatively (yes, easy!)

``` sh
./run.sh stage
```

### For development purpose

You can run the ui application using webpack-dev-server. This will compile and serve the pages at 8090 port.

``` sh
npm install
npm run dev
```

- Prepare the database using schema from [init.sql](rapido-db/init.sql)

- Api server can be run using standard node conventions. Note, you may want to override below environment variables before running

``` sh
npm install
npm start
```
Environment variables :

``` sh
DB_HOST
DB_PORT
DB_USER
DB_SCHEMA
DB_PASSWORD
```

### For Production purpose

Production mode uses RDS as persistence layer. Please set the appropriate environment variables mentioned in [docker-compose.yml](docker-compose.yml) and

``` sh
./run.sh
```
