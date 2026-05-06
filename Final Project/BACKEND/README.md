# Menu System Backend

A backend API for a menu system application built with Express.js and MongoDB.

## Features

### Business Owner
- List and manage restaurants
- Add and edit restaurant details (location, description, etc.)
- Manage menu items
- View analytics (top-selling items, top customers)
- View and manage orders

### Customers
- Browse restaurants
- Search restaurants by name and location
- View restaurant details
- View and order menu items
- Select quantity for items

## Project Structure

```
src/
├── controllers/     # Business logic for routes
├── routes/          # API routes
├── models/          # Database models
├── middleware/      # Custom middleware
├── config/          # Configuration files
├── utils/           # Utility functions
└── index.js         # Express app setup
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (local or hosted)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your MySQL connection string and other configurations.

4. Set up the database schema:
```bash
npm run prisma:generate
npm run prisma:migrate
```
5. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Available Scripts

- `npm start` - Run the server
- `npm run dev` - Run the server with nodemon (auto-restart on changes)
- `npm test` - Run tests

## API Endpoints

(To be documented as we add routes)

## License

ISC
