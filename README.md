# Smart Banking UI — MERN Edition

A full banking web app: **React (Vite) frontend**, **Express.js REST API backend**, **MongoDB** database.

```
Frontend (React)  →  Vercel
Backend  (Express) →  Render
Database (MongoDB) →  MongoDB Atlas
```

## 📁 Project Structure

```
smart-banking-ui/
├── src/                      <- React frontend
│   ├── utils/api.js          <- HTTP client for the Express API (JWT auth)
│   ├── utils/pdfReceipt.js   <- jsPDF receipts/statements
│   ├── context/AuthContext.jsx
│   ├── components/
│   └── pages/
├── server/                   <- Express + MongoDB backend
│   ├── server.js             <- app entry point
│   ├── seed.js                <- creates the default admin user
│   ├── config/db.js          <- Mongoose connection
│   ├── models/                <- User, Account, Transaction schemas
│   ├── middleware/auth.js    <- JWT auth + admin guard
│   ├── routes/                <- auth, accounts, transactions, admin
│   └── render.yaml            <- Render deploy blueprint
├── vercel.json                <- Vercel SPA rewrite rule
├── .env.example                <- frontend env (VITE_API_URL)
└── server/.env.example         <- backend env (MONGO_URI, JWT_SECRET, CLIENT_ORIGIN)
```

## 🗄️ 1. Set up MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Create a database user + password.
3. Network Access → allow access from anywhere (`0.0.0.0/0`) for Render to connect.
4. Copy the connection string — this is your `MONGO_URI`.

## ⚙️ 2. Run the backend locally

```bash
cd server
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET
npm install
npm run seed              # creates admin@smartbank.com / admin123
npm run dev                # starts on http://localhost:5000
```

## 💻 3. Run the frontend locally

```bash
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # starts on http://localhost:5173
```

## ☁️ 4. Deploy

### Backend → Render
1. Push this repo to GitHub.
2. New Web Service on Render → connect the repo → set **Root Directory** to `server`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (your Vercel URL, added after step 5).
5. Deploy. Note the Render URL, e.g. `https://smart-banking-server.onrender.com`.
6. Run the seed script once (Render Shell): `npm run seed`.

### Frontend → Vercel
1. New Project on Vercel → import the repo (root = repository root, framework = Vite).
2. Add environment variable: `VITE_API_URL=https://smart-banking-server.onrender.com/api`.
3. Deploy. Note the Vercel URL.
4. Go back to Render → set `CLIENT_ORIGIN` to that Vercel URL → redeploy backend.

## 🔑 Demo Admin Login
- Email: `admin@smartbank.com`
- Password: `admin123`

## ✅ Features
- Register / Login / Logout (JWT, 7-day expiry)
- Forgot Password (reset by email)
- Multi-account creation, balance check
- Deposit / Withdraw / Transfer (transfers use a MongoDB transaction for atomicity)
- Transaction history per account
- PDF receipt per transaction + PDF statement per account (jsPDF)
- Admin Dashboard: live MongoDB data, Excel/CSV export (via `xlsx`), data reset
- Passwords hashed with **bcrypt** server-side — never stored or shown in plain text, including in admin views (masked as `********`)
- Login/Register forms reset on every visit and use autofill-guarding to prevent browsers from showing a previous user's saved credentials

## 📦 Backend Libraries
`express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`, `helmet`, `express-rate-limit`

## 📦 Frontend Libraries
`react`, `react-router-dom`, `xlsx` (admin Excel export), `jspdf` + `jspdf-autotable` (PDF), `tailwindcss`
