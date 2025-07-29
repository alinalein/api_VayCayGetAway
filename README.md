# api_VayCayGetAway 🏝️🌍

A modular RESTful API that allows users to explore, rate, and comment on vacation spots. It supports user registration, authentication, profile management, and managing lists of favorite places. The API is available in two technology stacks – one in JavaScript (with MongoDB and JWT), and one in TypeScript (with PostgreSQL and OAuth2).

## Technology Stack 🛠️

### 🔹 JavaScript + MongoDB Version

- **Node.js**: Runtime for server-side JavaScript
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB

### 🔹 TypeScript + PostgreSQL Version

- **Node.js + TypeScript**: Type-safe server-side development
- **PostgreSQL**: Relational SQL database
- **Prisma**: Type-safe ORM for PostgreSQL

### 🔹 Shared Tools

- **Express.js**: Minimalist web framework
- **OAuth2**: Secure login and authorization
- **JWT**: JSON Web Token for stateless authentication
- **Postman**: API testing and debugging

## Getting Started 🚀

This project supports two versions via Git branches:

### 🔹 JavaScript + MongoDB Version

Switch to the `with_MongoDB` branch:

```
git clone https://github.com/yourusername/api_VayCayGetAway.git
cd api_VayCayGetAway
git checkout with_MongoDB
npm install
npm run dev
```

### 🔹 TypeScript + PostgreSQL Version

Switch to the `with_PostgreSQL` branch:

```
git clone https://github.com/yourusername/api_VayCayGetAway.git
cd api_VayCayGetAway
git checkout with_PostgreSQL
npm install
npm run dev
```

## API Endpoints 🔍

### User Routes

- `POST /signup` – Register a new user
- `POST /login` – Log in with credentials
- `GET /users` – Get a list of all users
- `GET /auth/google` – Redirects the user to Google's OAuth2 login page
- `GET /auth/google/callback` – Handles the callback from Google after authentication
- `PUT /updateProfile` – Update user profile
- `PUT /changePassword ` – Change password
- `DELETE /deleteProfie` – Delete user account
- `POST /addDestination/:type/:destinationId` – Add spot to favorites
- `DELETE /deleteDestination/:type/:destinationId` – Remove spot from favorites

### Vacation Spot Routes

- `GET /destinations` – List all vacation spots
- `GET /destinations/:id` – Get detailed info about a vacation spot
- `GET /tags` – Get an array of all tags within the destinations

### Reviews Routes

- `GET /reviews` – List all reviews
- `POST /writeReview/:destinationId` – Write a comment and rate a destination (1–5 stars)
- `DELETE /deleteReview/:reviewId` – Delete a comment
- `PUT /updateReview/:reviewId` – Update a comment or rating
- `GET /rating/:destinationId` – Get average rating for a destination

### Unsplash Routes

- `GET /api/unsplash/reviews` – Load 25 pictures per page for the seach query
- `POST /api/unsplash/save-image` – Save the image to the database

#### How the POST route works:

- Stores the **image URL** and **photographer name**
- Saves the data inside the **destination entry** whose `name` matches the **search query**
- The image is stored under one of the following keys:
  - `image_horizontal` – if the **"Save as Horizontal"** button was clicked
  - `image_vertical` – if the **"Save as Vertical"** button was clicked

### Unsplash Image Picker Tool

This tool allows you to search images from [Unsplash](https://unsplash.com/) API and save them to your local database.

Requirements:

- `.env` file with a valid `UNSPLASH_ACCESS_KEY`
- A running database with the correct schema
- Backend server running (`npm run dev` or similar)

Access the tool at [http://localhost:3000/viewUnsplashImages.html](http://localhost:3000/viewUnsplashImages.html)

## Testing the API 🧪

All endpoints were tested using **Postman**.  
To test on your own machine:

1. Open the `postman-tests` folder in this repo  
2. Import the corresponding .postman_collection.json file into your Postman client (either for MongoDB or PostgreSQL).
3. Make sure your server is running.
4. Open Postman and run the desired requests or test collections.
   
## Deployment

This project is currently in development.  
Deployment instructions (e.g. Heroku, Railway, Render) will be added soon.

## User Stories 👥

- As a user, I want to register and manage my profile so that I can personalize my experience.
- As a user, I want to rate and comment on vacation spots to help others make informed choices.
- As a user, I want to maintain a list of favorite places for future reference.

## Features ✅

- User registration and authentication (JWT and OAuth2)
- 5-star rating system for vacation spots
- Commenting system with moderation-friendly structure
- Favorites list for each user
- Modular codebase with middleware and controller separation
- Two complete versions (JavaScript + TypeScript)

## Coming Soon 🌐

- Live demo links

