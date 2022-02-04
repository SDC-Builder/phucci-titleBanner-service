# Project Name

> Project description
    - Forked by Phucci

## Related Projects
  - https://github.com/SDC-Builder/phucci-proxy
  - https://github.com/SDC-Builder/Shane-Syllabus-Service
  - https://github.com/SDC-Builder/Tim-About-Service
  - https://github.com/SDC-Builder/Nelson-Review-Service

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## CRUD Operations
  CREATE:
   -> POST /api/tittle/
   -> Request body: { tittle: 'name of tittle' }
   -> ID of the new tittle is auto-created & auto-incremented

  READ:
   -> GET /api/tittle/:id
   -> Returns a string tittle that belongs to the param's id

  UPDATE:
   -> PUT /api/tittle/:id
   -> Request body: { tittle: 'new tittle' }

  DELETE:
   -> DELETE /api/tittle/:id

## Usage

> Some usage instructions

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

## Travis CI
[![Build Status](https://travis-ci.org/Ingenuity-rpt26/vinay-titleBanner-service.svg?branch=main)](https://travis-ci.org/Ingenuity-rpt26/vinay-titleBanner-service)


## license
![NPM](https://img.shields.io/npm/l/express)
