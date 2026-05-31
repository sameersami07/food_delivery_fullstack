# Tomato Food Delivery

A React + Express food delivery demo app built with Vite, TypeScript, and a lightweight server for local development.

## Overview

Tomato is a full-stack food ordering application with a client-side React SPA and an Express backend for product, cart, and order APIs. It runs locally using `tsx` and Vite middleware.

## Features

- Browse food items by category
- Add items to a cart
- Register and login users
- Place orders and verify checkout
- Admin-friendly endpoints for managing foods and orders

## Tech stack

- React 19
- TypeScript
- Vite
- Express
- Node.js

## Run locally

### Prerequisites

- Node.js 20+ recommended

### Install

```bash
npm install
```

### Start the app

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Project structure

- `server.ts` — Express backend and Vite middleware integration
- `src/` — React application
- `db.json` — local JSON data store for users, carts, foods, and orders
- `package.json` — scripts and dependencies

## API Endpoints

- `POST /api/user/register`
- `POST /api/user/login`
- `GET /api/food/list`
- `POST /api/food/add`
- `POST /api/cart/add`
- `POST /api/cart/remove`
- `POST /api/cart/get`
- `POST /api/order/place`
- `POST /api/order/verify`
- `POST /api/order/userorders`
- `GET /api/order/list`

## Notes

- `db.json` persists demo data locally.
- No external environment variables are required for local development.
- Do not commit sensitive data or production secrets.

## License

MIT
