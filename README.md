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

## Development workflow

This project uses a GitHub-based development workflow:

1. Create an Issue
2. Move it to In Progress
3. Create a dedicated branch
4. Implement and test the changes
5. Open a Pull Request
6. Review the changes
7. Merge into `main`
8. Move the Issue to Done