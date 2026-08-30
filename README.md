# 🎮 Game Store

Full-stack game e-commerce project built with a decoupled architecture. The
frontend and backend are independent applications that communicate through a
REST API using HTTP and JSON.

## Current status

🚧 In development.

The responsive storefront interface is available with:

- Gamer-inspired landing page
- Featured game catalog
- Category filters
- Game search
- Interactive shopping cart
- Responsive desktop and mobile navigation
- Project architecture showcase

The catalog is served by the Laravel REST API. The backend also provides
Sanctum token authentication and persistent carts for authenticated users.

## Stack

### Backend

- PHP
- Laravel
- REST API
- PostgreSQL
- Eloquent ORM

### Frontend

- React 19
- TypeScript
- React Compiler
- Vite
- Lucide React
- CSS

## Architecture

```text
React + TypeScript
        ↓
     REST API
        ↓
      Laravel
        ↓
    PostgreSQL
```

## Project structure

```text
game-store/
├── backend/   # Laravel API
└── frontend/  # React application
```

## Running the frontend

Requirements:

- Node.js 20 or newer
- npm

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Frontend checks

```bash
npm run lint
npm run build
```

## Running the backend

Requirements:

- PHP 8.2 or newer
- Composer
- PostgreSQL

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Configure the PostgreSQL connection in `backend/.env` before running the
migrations.

## Roadmap

- Complete the Laravel REST API
- Persist games and categories in PostgreSQL
- Connect the React catalog to the API
- Connect the authentication interface
- Connect the persistent cart interface
- Implement checkout
- Add automated tests

## Development workflow

1. Create an issue.
2. Move it to **In Progress**.
3. Create a dedicated branch.
4. Implement and test the changes.
5. Open a pull request.
6. Review and merge into `main`.
7. Move the issue to **Done**.
