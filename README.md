This is a https://nextjs.org/ project bootstrapped with https://github.com/vercel/next.js/tree/canary/packages/create-next-app.

  

## Getting Started

  

First, run the development server:

  

bash

npm  run  dev

# or

yarn  dev

# or

pnpm  dev

# or

bun  dev



  

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

  

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

  

This project uses https://nextjs.org/docs/basic-features/font-optimization to automatically optimize and load Inter, a custom Google Font.

  

## Learn More

  

To learn more about Next.js, take a look at the following resources:

  

- https://nextjs.org/docs - learn about Next.js features and API.

- https://nextjs.org/learn - an interactive Next.js tutorial.

  

You can check out https://github.com/vercel/next.js/ - your feedback and contributions are welcome!

  

## Deploy on Vercel

  

The easiest way to deploy your Next.js app is to use the https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme from the creators of Next.js.

  

Check out our https://nextjs.org/docs/deployment for more details.


## Installation 
Follow these steps to set up the project: 1. Clone the repository: ```bash git clone <repository_url> cd <repository_directory>

npm install # or yarn install

## Configuration

### Environment Variables

This project uses environment variables for configuration. This project has different .env file for different environments. Here's a brief explanation of the available environment variables:

-   `.env.development`: Environment variables specific to the development environment.
-   `.env.staging`: Environment variables specific to the staging environment.
-   `.env.production`: Environment variables specific to the production environment.



## Available Scripts

### Development

-   `npm run build:staging` or `yarn build:staging`: Creates a new build in the staging mode.
-   `npm run start:staging` or `yarn start:staging`: Starts the development server in staging mode.

### Production

-   `npm run build:production` or `yarn build:production`:  Creates a new build in the production mode.
-   `npm run start:production` or `yarn start:production`: Starts the development server in production mode.

#### To start the application in production mode you can also use

-   `npm run build` or `yarn build`:  Creates a new build in the production mode.
-   `npm start` or `yarn start`: Starts the development server in production 

## Additional Information
`This README provides detailed explanations for the .env files, including their purpose and usage within the project. Adjustments can be made based on your specific environment variable requirements or naming conventions.`