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
