# Raffles Frontend + Admin Dashboard

## Stack

- NextJS React framework (Typescript)
- TailwindCSS (with purgeCSS) using Material Design

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. Set up the environment variables in the `.env` file. You are required to have
   a firebase project
2. Register a web app on firebase and add the credentials to the `.env` file.
3. Create a firestore database with the following collections:
   - `names`
   - `config`
4. Refer to the Name type in `enum.ts` for the structure of the names
   collection.
5. Refer to the Settings enum in `enum.ts` for the structure of the config
   collection.
6. Create a storage bucket in firebase and add the credentials to the `.env`
   file.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `pages/index.js`. The page
auto-updates as you edit the file.
