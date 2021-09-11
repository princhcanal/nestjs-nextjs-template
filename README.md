# NestJS/React Template

The goal of this template is to create a template for full stack web development
using [NestJS](https://nestjs.com/) as the backend framework and
[NextJS](https://nextjs.org/) as the frontend framework

## How to develop locally

### Step 1: Have a PostgreSQL database instance running

_With docker-compose_

```bash
cd backend
docker-compose up
```

_Without docker-compose_

Install [Docker Desktop](https://docs.docker.com/desktop/) if you haven't already
and follow the steps to get a PostgreSQL database up and running

### Step 2: Install backend dependencies

```bash
cd backend
npm install
```

### Step 3: Set the required environment variables

Create a `.env` file with the following environment variables inside the backend
folder:

`POSTGRES_HOST`: the Postgres host (usually `localhost`)

`POSTGRES_PORT`: the Postgres port (usually `5432`)

`POSTGRES_USER`: User for your Postgres database

`POSTGRES_PASSWORD`: Password for your Postgres database

`POSTGRES_DB`: name of your Postgres database

`JWT_ACCESS_TOKEN_SECRET`: Secret key for signing JWT access tokens

`JWT_ACCESS_TOKEN_EXPIRATION_TIME`: Expiration time in ms for signing JWT access
tokens

`JWT_REFRESH_TOKEN_SECRET`: Secret key for signing JWT refresh tokens

`JWT_REFRESH_TOKEN_EXPIRATION_TIME`: Expiration time in ms for signing JWT refresh
tokens

### Step 4: Start up the backend server

```bash
npm run start:dev
```

### Step 5: Make sure the backend is running

Visit `localhost:5000` in your browser and make sure you see a message saying
`Hello World!`
