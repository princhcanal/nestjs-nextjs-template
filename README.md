# NestJS/NextJS Template

The goal of this project is to create a template for full stack web development
using [NestJS](https://nestjs.com/) as the backend framework and
[NextJS](https://nextjs.org/) as the frontend framework

## How to develop locally

### Step 1: Set the required environment variables

Create a `.env` file with the following environment variables inside the backend
folder:

`DATABASE_URL`: postgres://`dbName`:`dbPassword`@`dbHost`:`dbPort`/`dbName`

`JWT_ACCESS_TOKEN_SECRET`: Secret key for signing JWT access tokens

`JWT_ACCESS_TOKEN_EXPIRATION_TIME`: Expiration time in ms for signing JWT access
tokens

`JWT_REFRESH_TOKEN_SECRET`: Secret key for signing JWT refresh tokens

`JWT_REFRESH_TOKEN_EXPIRATION_TIME`: Expiration time in ms for signing JWT refresh
tokens

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Have a PostgreSQL database instance running

_With docker-compose_

```bash
cd backend
docker-compose up
```

_Without docker-compose_

Install [PostgreSQL](https://www.postgresql.org/download/) if you haven't already
and follow the steps to get a PostgreSQL database up and running

### Step 4: Start the app

```
npm run start:dev
```

### Step 5: Make sure the app is running by visiting http://localhost:3000
