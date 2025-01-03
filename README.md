This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
Movie API Documentation
Overview
The Movie API is a simple RESTful service that allows users to manage a movie database. Users can create, update, delete, and retrieve movies. Authentication is required for accessing these endpoints to ensure data security.

Authentication
All API endpoints are protected by an authentication mechanism. Users must sign in and obtain a JWT token to interact with the API. 

Authentication API (Sign-In)
Endpoint: /api/auth/signin
Method: POST
Description: Authenticates the user and returns a JWT token.

API Endpoints
1. Create Movie
Endpoint: /api/movies/create
Method: POST
Description: Adds a new movie to the database.



2. Update Movie
Endpoint: /api/movies/update
Method: PUT
Description: Updates the details of an existing movie.



3. Delete Movie
Endpoint: /api/movies/delete
Method: DELETE
Description: Deletes a movie from the database.

4. Retrieve Movies
Endpoint: /api/movies
Method: GET
Description: Fetches a list of all movies.

Error Handling
Standard error responses for all endpoints include:



Usage
Authenticate by sending a POST request to /api/auth/signin and obtain the token.
Use the endpoints to create, update, delete, or fetch movies from the database.
