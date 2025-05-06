# api_VayCayGetAway 🏝️🌍

A modular RESTful API that allows users to explore, rate, and comment on vacation spots. It supports user registration, authentication, profile management, and managing lists of favorite places. The API is available in two technology stacks – one in JavaScript (with MongoDB and JWT), and one in TypeScript (with PostgreSQL and OAuth2).

## Technology Stack 🛠️

- **Node.js**: Runtime for server-side JavaScript applications  
- **Express.js**: Minimalist web framework for Node.js  
- **MongoDB**: NoSQL database for flexible data storage (JavaScript variant)  
- **Mongoose**: ODM for MongoDB and Node.js  
- **PostgreSQL**: Relational SQL database (TypeScript variant)
- **Prisma:** ORM for Node.js and TypeScript that enables type-safe database access and simplifies querying.
- **OAuth2**: Secure login and authorization protocol  
- **JWT**: JSON Web Token for stateless authentication  
- **Postman**: For testing endpoints and debugging  
- **JSDoc / TypeDoc**: For automatic code documentation generation  

## Getting Started 🚀

### Clone the repository:
```
git clone https://github.com/yourusername/api_VayCayGetAway.git

```
### Change the directory:
```
cd api_VayCayGetAway
```
### Install the dependencies
```
npm install
```
### Run the server
```
npm dev
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

## Testing the API 🧪

All endpoints were tested using **Postman**.  
To test on your own machine:

1. Open the `postman-tests` folder in this repo  
2. Import the collection into your Postman client  
3. Make sure your server is running

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

