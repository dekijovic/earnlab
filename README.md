
## Earnlab task

Earnlab task
## Project setup

```bash
$ npm install
docker compose up
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Description

Swagger is added to document the endpoints

Bull Queue is used for background job for creditTransfer log

Postgre and Redis are added via docker compose