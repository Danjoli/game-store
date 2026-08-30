# Game Store API

Laravel REST API for the Game Store catalog.

## Requirements

- PHP 8.2 or newer
- Composer
- PostgreSQL

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Configure the PostgreSQL connection in `.env` before running migrations.

## Categories

The category domain includes:

- Eloquent model with automatic slug generation
- Unique names and slugs
- Factory and idempotent seeder
- Six complete demonstration games with original cover art
- JSON resource
- Public read endpoints

### Endpoints

```text
GET /api/categories
GET /api/categories/{slug}
```

## Games

The games endpoint returns the camelCase contract consumed by the React
frontend, including category, prices, rating and cover style.

```text
GET /api/games
GET /api/games/{slug}
```

Optional catalog filters:

```text
GET /api/games?search=neon
GET /api/games?category=acao
GET /api/games?search=neon&category=acao
```

## Authentication

Authentication uses Laravel Sanctum bearer tokens.

```text
POST /api/register
POST /api/login
GET  /api/me
POST /api/logout
```

Registration requires `name`, `email`, `password` and
`password_confirmation`. Protected routes receive the token as
`Authorization: Bearer <token>`.

## Cart

Each authenticated user has one persistent cart. A game can appear only once
in the cart and supports quantities from 1 to 99.

```text
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/{game_id}
DELETE /api/cart/items/{game_id}
DELETE /api/cart
```

Add an item:

```json
{
  "game_id": 1,
  "quantity": 1
}
```

## Administration

Administrative endpoints require a Sanctum bearer token from a user whose
`is_admin` field is enabled. The database seeder creates the following local
development administrator:

```text
Email: test@example.com
Password: password
```

Available endpoints:

```text
GET    /api/admin/dashboard
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/{category}
DELETE /api/admin/categories/{category}
GET    /api/admin/games
POST   /api/admin/games
PUT    /api/admin/games/{game}
DELETE /api/admin/games/{game}
```

The dashboard reports totals for games, categories, users and carts. Category
deletion is blocked while games are associated with it.

Example response:

```json
{
  "data": {
    "id": 1,
    "name": "Ação",
    "slug": "acao"
  }
}
```

## Tests

```bash
php artisan test
```

The test suite uses an in-memory SQLite database and does not modify the local
PostgreSQL database.

## Code style

```bash
vendor/bin/pint
```
