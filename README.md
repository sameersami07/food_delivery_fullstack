# 🍅 Tomato Food Delivery

A modern full-stack food delivery web app powered by **free Google APIs** — built with React, Express, TypeScript, and Vite.

**Live demo:** [food-delivery-fullstack-svvz.onrender.com](https://food-delivery-fullstack-svvz.onrender.com)

---

## ✨ Powered by Google (Free Tier)

This project goes beyond a basic food ordering demo. It integrates **three free Google APIs** to deliver a polished, production-style experience:

| Google API | What it does | Where you see it |
|------------|--------------|------------------|
| **Gemini AI** | Auto-generates appetizing menu descriptions, categories, and prices | Admin → Add Food → **AI Generate** |
| **Google Maps (Places)** | Smart address autocomplete at checkout | Cart → Checkout → **Street Address** field |
| **Google Sign-In** | One-click login with your Google account | Login popup → **Continue with Google** |

These integrations create real **wow moments** for users and reviewers — AI-assisted admin tools, frictionless checkout, and trusted authentication.

---

## 🎯 Key Features

### Customer experience
- Browse food by category (Salad, Rolls, Desserts, Pasta, and more)
- Add items to cart with live sync
- **Google Maps address autocomplete** — type an address, pick a suggestion, city/state/zip auto-fill
- Simulated Stripe checkout flow
- Track order status (Processing → Out for Delivery → Delivered)
- **Sign in with Google** or email/password

### Admin panel (owner-only)
- Manage orders and update delivery status
- Add, list, and delete menu items
- **Gemini AI menu writer** — enter a dish name like *"Spicy chicken biryani"* and AI fills description, category, and price
- Restricted access via `ADMIN_EMAIL` — only the site owner can access admin

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite |
| Backend | Express, Node.js |
| Database | JSON file store (`db.json`) |
| AI | Google Gemini (`@google/genai`) |
| Maps | Google Places Autocomplete |
| Auth | Google OAuth + custom token auth |
| Deploy | Docker, Render |

---

## 🚀 Run Locally

### Prerequisites
- Node.js 20+

### 1. Clone & install

```bash
git clone https://github.com/sameersami07/food_delivery_fullstack.git
cd food_delivery_fullstack
npm install
```

### 2. Configure environment

Copy the example env file and add your free Google API keys:

```bash
cp .env.example .env
```

| Variable | Get it free at |
|----------|----------------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GOOGLE_MAPS_API_KEY` | [Google Maps Platform](https://console.cloud.google.com/google/maps-apis) (enable **Places API**) |
| `GOOGLE_CLIENT_ID` | [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials/oauthclient) |
| `ADMIN_EMAIL` | Your email — only this account gets admin access |

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker

```bash
docker build -t tomato .
docker run -p 3000:3000 --env-file .env tomato
```

---

## ☁️ Deploy on Render

1. Connect this GitHub repo as a **Docker** web service
2. Add environment variables in **Environment** tab:
   - `GEMINI_API_KEY`
   - `GOOGLE_MAPS_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `ADMIN_EMAIL`
   - `APP_URL` (your Render URL)
3. Deploy — Render auto-builds from `Dockerfile`

---

## 📁 Project Structure

```
├── server.ts              # Express API + Google integrations
├── src/
│   ├── components/        # UI components (Maps autocomplete, Google Sign-In)
│   ├── context/           # Global state & API calls
│   ├── pages/             # Home, Cart, Checkout, Admin
│   └── hooks/             # Public config loader
├── Dockerfile             # Multi-stage Node.js production build
└── db.json                # Local data store
```

---

## 🔌 API Endpoints

### Public
- `GET /api/food/list` — menu items
- `POST /api/user/register` — create account
- `POST /api/user/login` — email login
- `POST /api/user/google` — Google Sign-In
- `GET /api/config/public` — client-side Google keys

### Authenticated (customer)
- `POST /api/cart/add` · `POST /api/cart/remove` · `POST /api/cart/get`
- `POST /api/order/place` · `POST /api/order/verify` · `POST /api/order/userorders`

### Admin only
- `POST /api/food/add` · `POST /api/food/remove`
- `GET /api/order/list` · `POST /api/order/status`
- `POST /api/ai/generate-food-details` — **Gemini AI**

---

## 🔐 Security Notes

- Never commit `.env` — it is gitignored
- Admin routes are protected server-side with token + `ADMIN_EMAIL` check
- Gemini API key stays on the server (never exposed to the browser)
- Restrict Google API keys by HTTP referrer in Google Cloud Console

---

## 👤 Author

**Sameer Sami** — [GitHub](https://github.com/sameersami07)

---

## 📄 License

MIT
