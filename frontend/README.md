# Game Store Frontend

Responsive storefront built with React, TypeScript and Vite.

## Features

- Featured game hero
- Searchable game catalog
- Category filters
- Interactive shopping cart
- Responsive navigation
- Desktop, tablet and mobile layouts

Without API configuration, the app uses local demonstration data. To connect the
Laravel API, copy `.env.example` to `.env` and configure `VITE_API_URL`. The
frontend expects the games endpoint at `/api/games`.

## Requirements

- Node.js 20 or newer
- npm

## Development

Install the dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

The application will be available at
[http://localhost:5173](http://localhost:5173).

## Available scripts

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
```

## Main files

```text
src/
├── components/ # Storefront interface components
├── data/       # Local fallback data
├── hooks/      # Reusable application state
├── services/   # Laravel API access
├── types/      # TypeScript domain types
├── utils/      # Shared formatters
├── App.tsx     # Application composition and cart state
├── App.css     # Storefront and responsive styles
├── index.css   # Global styles
└── main.tsx    # React entry point
```

Static assets are stored in `public/`.
