# Production deployment

No secret is committed to this repository. Copy the example files and fill the
values in the deployment platform's secret manager.

## Required backend variables

```dotenv
APP_NAME="Game Store"
APP_ENV=production
APP_KEY=                 # generate with: php artisan key:generate --show
APP_DEBUG=false
APP_URL=https://api.example.com
FRONTEND_URL=https://store.example.com
CORS_ALLOWED_ORIGINS=https://store.example.com

DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_ENCRYPT=true

MAIL_MAILER=smtp         # or resend / ses / mailgun
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@example.com
MAIL_FROM_NAME="Game Store"

PAYMENT_DRIVER=mercado_pago
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_WEBHOOK_SECRET=
MERCADO_PAGO_NOTIFICATION_URL=https://api.example.com/api/webhooks/mercado-pago

DEMO_ADMIN_EMAIL=
DEMO_ADMIN_PASSWORD=
```

## Required frontend variables

```dotenv
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=       # optional, e.g. G-XXXXXXXXXX
```

Variables beginning with `VITE_` are public and included in the browser build.
Never put private API tokens in them.

## Release commands

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm ci
npm run build
```

Run a persistent queue worker for transactional e-mails:

```bash
php artisan queue:work --tries=3 --backoff=10
```

Create the first administrator without committing credentials:

```bash
php artisan tinker
```

Then update the intended user with `is_admin = true`, or temporarily provide
`DEMO_ADMIN_EMAIL` and a strong `DEMO_ADMIN_PASSWORD` for one seed execution
and remove both variables immediately afterwards.

## Mercado Pago

Create an application in Mercado Pago, paste the production access token and
webhook secret into the variables above, and subscribe the webhook URL to
payment events. The backend independently fetches the payment before changing
an order, so browser redirects are never considered proof of payment.

## Operations checklist

- Point both domains to HTTPS-only endpoints.
- Restrict database and Redis access to the private network.
- Schedule daily encrypted PostgreSQL backups and test restores monthly.
- Monitor `/up`, queue failures, HTTP 5xx responses and payment webhook errors.
- Rotate application, payment, mail and database credentials periodically.
- Review the legal text with qualified counsel before commercial launch.
