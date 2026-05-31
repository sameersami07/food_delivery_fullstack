# 🍅 Tomato Food Delivery

> **A full-stack food delivery app built with React + Express, enhanced by 3 free Google APIs for AI, maps, and authentication.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://food-delivery-fullstack-svvz.onrender.com)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/apikey)
[![Google Maps](https://img.shields.io/badge/Google-Maps_Places-34A853?style=for-the-badge&logo=googlemaps&logoColor=white)](https://console.cloud.google.com/google/maps-apis)
[![Google Sign-In](https://img.shields.io/badge/Google-Sign--In-EA4335?style=for-the-badge&logo=google&logoColor=white)](https://console.cloud.google.com/apis/credentials/oauthclient)

**Live app:** [https://food-delivery-fullstack-svvz.onrender.com](https://food-delivery-fullstack-svvz.onrender.com)

---

## 🌟 Why This Project Stands Out — Google APIs Integration

Most food delivery demos stop at a basic cart and login. **Tomato uses Google's free developer tools** to deliver a real product feel:

### 1. 🤖 Google Gemini AI — Smart Menu Generator
**API:** [Gemini Developer API](https://ai.google.dev/) · **Free tier:** [Google AI Studio](https://aistudio.google.com/apikey)

| | |
|---|---|
| **What it does** | Admin types a dish idea → Gemini writes description, category & price |
| **Where to try** | Admin Dashboard → Add Food → **AI Generate** |
| **Tech** | `@google/genai` on server (`POST /api/ai/generate-food-details`) |
| **Why it impresses** | Shows AI-powered content creation in a real admin workflow |

**Example:** Type *"Hyderabadi chicken biryani"* → get a polished menu entry in one click.

---

### 2. 🗺️ Google Maps Places API — Address Autocomplete
**API:** [Google Maps Platform — Places](https://developers.google.com/maps/documentation/places/web-service) · **Free credit:** [$200/month](https://mapsplatform.google.com/pricing/)

| | |
|---|---|
| **What it does** | Type an address → Google suggests locations → city, state, zip auto-fill |
| **Where to try** | Add to cart → Checkout → **Street Address** field |
| **Tech** | Places Autocomplete via `AddressAutocomplete.tsx` |
| **Why it impresses** | Real-world checkout UX like Swiggy, Uber Eats, or DoorDash |

---

### 3. 🔐 Google Sign-In (OAuth 2.0) — One-Click Login
**API:** [Google Identity Services](https://developers.google.com/identity/gsi/web) · **Setup:** [OAuth Client ID](https://console.cloud.google.com/apis/credentials/oauthclient)

| | |
|---|---|
| **What it does** | Sign in or register instantly with your Google account |
| **Where to try** | Click **Sign In** → **Continue with Google** |
| **Tech** | Server verifies ID token (`POST /api/user/google`) |
| **Why it impresses** | Trusted auth without password friction |

---

## 📸 Google API Features at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│  🍕 CUSTOMER APP                                            │
│  ├── Browse menu by category                                │
│  ├── 🗺️  Google Maps autocomplete at checkout               │
│  ├── 🔐 Google Sign-In OR email/password                    │
│  └── Track orders live                                      │
├─────────────────────────────────────────────────────────────┤
│  👨‍💼 ADMIN PANEL (owner-only via ADMIN_EMAIL)               │
│  ├── 🤖 Gemini AI — auto-generate food descriptions         │
│  ├── Manage orders & delivery status                        │
│  └── Add / remove menu items                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Full Feature List

### Customer
- Browse food by category (Salad, Rolls, Desserts, Pasta, Noodles…)
- Cart with live server sync
- **Google Maps** address autocomplete on checkout
- Simulated Stripe payment flow
- Order tracking (Processing → Out for Delivery → Delivered)
- **Google Sign-In** + email registration

### Admin (restricted to `ADMIN_EMAIL`)
- **Gemini AI** menu writer for instant product listings
- Order management & status updates
- Full food catalog CRUD

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite |
| Backend | Express, Node.js |
| **AI** | **Google Gemini** (`@google/genai`) |
| **Maps** | **Google Places Autocomplete** |
| **Auth** | **Google OAuth 2.0** + token-based sessions |
| Database | JSON file store (`db.json`) |
| Deploy | Docker → Render |

---

## 🔑 Google API Setup (Free)

All three APIs have **free tiers** — no credit card needed for Gemini, and Maps/Sign-In include generous free usage.

### Step 1 — Copy env file
```bash
cp .env.example .env
```

### Step 2 — Add your free Google keys

| Env Variable | Google API | Get it here |
|--------------|------------|-------------|
| `GEMINI_API_KEY` | Gemini AI | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `GOOGLE_MAPS_API_KEY` | Maps Places | [console.cloud.google.com/google/maps-apis](https://console.cloud.google.com/google/maps-apis) |
| `GOOGLE_CLIENT_ID` | Sign-In OAuth | [console.cloud.google.com/apis/credentials/oauthclient](https://console.cloud.google.com/apis/credentials/oauthclient) |
| `ADMIN_EMAIL` | — | Your email (admin access only) |
| `APP_URL` | — | Your app URL (for OAuth origins) |

### Step 3 — Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Run Locally

**Prerequisites:** Node.js 20+

```bash
git clone https://github.com/sameersami07/food_delivery_fullstack.git
cd food_delivery_fullstack
npm install
cp .env.example .env   # add your Google API keys
npm run dev
```

---

## 🐳 Docker

```bash
docker build -t tomato .
docker run -p 3000:3000 --env-file .env tomato
```

---

## ☁️ Deploy on Render

1. Connect repo as a **Docker** web service
2. In **Environment** tab, add all Google API keys + `ADMIN_EMAIL` + `APP_URL`
3. For Google Sign-In, add your Render URL to **Authorized JavaScript origins** in Google Cloud
4. Deploy — builds from `Dockerfile` automatically

---

## 📁 Project Structure

```
├── server.ts                    # Express + Gemini + Google auth routes
├── src/
│   ├── components/
│   │   ├── AddressAutocomplete.tsx   # 🗺️ Google Maps
│   │   └── GoogleSignInButton.tsx    # 🔐 Google Sign-In
│   ├── pages/admin/AdminLayout.tsx   # 🤖 Gemini AI Generate button
│   └── hooks/usePublicConfig.ts      # Loads Google client keys
├── Dockerfile
└── db.json
```

---

## 🔌 API Endpoints

| Route | Google API | Access |
|-------|-----------|--------|
| `POST /api/ai/generate-food-details` | **Gemini AI** | Admin |
| `POST /api/user/google` | **Google Sign-In** | Public |
| `GET /api/config/public` | Maps + OAuth keys | Public |
| `GET /api/user/me` | Session validation | Auth |
| `POST /api/cart/add` · `/remove` · `/get` | — | Auth |
| `POST /api/order/place` · `/verify` | — | Auth |
| `GET /api/food/list` | — | Public |

---

## 🔐 Security

- `.env` is gitignored — never commit API keys
- Gemini key runs **server-side only** (never exposed to browser)
- Admin protected by `ADMIN_EMAIL` + server-side token check
- Restrict Maps & OAuth keys by HTTP referrer in Google Cloud Console
- Stale sessions auto-clear with re-login prompt

---

## 👤 Author

**Sameer Sami** — [github.com/sameersami07](https://github.com/sameersami07)

Built with ❤️ using **Google Gemini AI**, **Google Maps**, and **Google Sign-In**.

---

## 📄 License

MIT
