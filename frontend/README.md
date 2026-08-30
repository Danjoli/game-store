# Game Store Frontend

Responsive storefront built with React, TypeScript and Vite.

## Features

- Featured game hero
- Searchable game catalog
- Category filters
- Interactive shopping cart
- Responsive navigation
- Desktop, tablet and mobile layouts

The game data is currently stored locally in `src/App.tsx`. It will be replaced
by data from the Laravel REST API as the backend evolves.

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
├── App.tsx    # Components, catalog data and interactions
├── App.css    # Storefront and responsive styles
├── index.css  # Global styles
└── main.tsx   # React entry point
```

Static assets are stored in `public/`.
