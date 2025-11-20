# REST API Cidades

## Main Techs

- JavaScript
- ExpressJS
- NodeJS
- PostgreSQL
- Prisma ORM

### Resources

- REST API with ExpressJS
- PostgreSQL database with Prisma ORM
- CRUD for Continents, Countries, and Cities

## Install dependencies

```sh
npm install
```

## Setup database

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env` and fill the `DATABASE_URL` with your database connection string.
3. Run the migrations:

```sh
npx prisma migrate dev --name init
```

### Populate database (optional)

```sh
npx prisma db seed
```

## Run in dev mode

```sh
npm run dev
```
