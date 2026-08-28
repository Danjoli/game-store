# 🎮 Game Store

Full-stack game e-commerce built with a completely decoupled architecture.

## Stack

### Backend

- PHP
- Laravel
- REST API
- PostgreSQL
- Eloquent ORM

### Frontend

- React
- TypeScript
- React Compiler
- Vite
- Tailwind CSS

## Architecture

```text
React + TypeScript
        ↓
     REST API
        ↓
      Laravel
        ↓
    PostgreSQL

The frontend and backend are independent applications and communicate exclusively through HTTP/JSON.

Project structure
game-store/
├── backend/
└── frontend/
Status

🚧 In development.

Goals
RESTful API with Laravel
PostgreSQL persistence
Game catalog
Categories and filters
Search
Shopping cart
Authentication
Checkout
Automated tests
Responsive gamer-inspired interface