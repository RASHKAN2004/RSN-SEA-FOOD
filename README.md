# RSN Sea Food

Fresh seafood delivery e-commerce platform for RSN Sea Food, based in Kalpitiya, Puttalam District, Sri Lanka.

This project includes a customer storefront, shopping cart, delivery-area logic, WhatsApp ordering, and an admin panel for managing the product catalog.

---

## Overview

RSN Sea Food is a seafood business website built for online ordering and local delivery across Sri Lanka. The app supports product browsing, district-based delivery pricing, WhatsApp checkout, and admin product management.

The project is split into:

- Frontend: Next.js storefront
- Backend: Express API with MongoDB
- Admin: secure product management dashboard

---

## Business Details

| Setting                                | Value                                   |
| -------------------------------------- | --------------------------------------- |
| Business Name                          | RSN Sea Food                            |
| Location                               | Kalpitiya, Puttalam District, Sri Lanka |
| Default Delivery District              | Puttalam                                |
| Delivery Coverage                      | All 25 Sri Lankan districts             |
| WhatsApp Number (Display)              | 0750519450                              |
| WhatsApp Number (International Format) | 94750519450                             |

Configuration files that control the business values:

- `frontend/lib/whatsapp.js`
- `frontend/lib/districts.js`
- `backend/config/districts.js`

---

## Features

### Customer Features

- Responsive seafood storefront
- Product catalog with categories and local names
- Product detail pages with image gallery and quantity controls
- District-based delivery area selection
- Shopping cart with totals and delivery fee logic
- Cash on Delivery, simulated card payment, and WhatsApp ordering
- Inquiry form and FAQ section
- Floating WhatsApp contact button
- SEO and mobile-friendly layout

### Admin Features

- Admin login and JWT-based authentication
- Product listing dashboard
- Add, edit, and delete products
- Product photo upload
- Price, description, category, and local name management
- MongoDB-backed product updates

---

## Tech Stack

- Frontend: Next.js 15, React 19, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT + bcrypt
- Security: Helmet, rate limiting, protected routes

---

## Project Structure

```text
rsn-seafood/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.js
├── README.md
├── vercel.json
└── package.json
```

---

## Quick Start

### 1. Backend Setup

Open the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
ADMIN_EMAIL=youremail@example.com
ADMIN_PASSWORD=YourStrongPassword123
```

Seed the product catalog:

```bash
ALLOW_DESTRUCTIVE_SEED=true npm run seed
```

This replaces the existing product catalog, so run it only when you intentionally want to reseed products.
In PowerShell, use `$env:ALLOW_DESTRUCTIVE_SEED="true"; npm run seed`.

Seed the admin user:

```bash
npm run seed:admin
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

### 2. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=94750519450
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

---

## Admin Access

Admin login page:

```text
http://localhost:3000/admin/login
```

Admin dashboard:

```text
http://localhost:3000/admin
```

Default admin email:

```text
mmohamedraskhan@gmail.com
```

Password must be set in the backend environment file before seeding. The recommended setup is to change it before deployment.

---

## API Endpoints

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/api/health`         | Health check             |
| GET    | `/api/products`       | List all products        |
| GET    | `/api/products/:slug` | Get product details      |
| POST   | `/api/auth/register`  | Register a user          |
| POST   | `/api/auth/login`     | Login and receive token  |
| POST   | `/api/orders`         | Place an order           |
| POST   | `/api/inquiries`      | Submit an inquiry        |
| GET    | `/api/meta/districts` | Get delivery districts   |
| GET    | `/api/meta/business`  | Get business information |

Supported order methods:

- Cash on Delivery
- Simulated Card Payment
- WhatsApp Manual Ordering

---

## Product Image Storage

Uploaded product images are stored in:

```text
backend/uploads/products/
```

They are served from:

```text
http://localhost:5000/uploads/products/<filename>
```

The public product image assets for the storefront are kept in:

```text
frontend/public/images/products/
```

---

## Environment Variables

### Backend

Create `backend/.env` with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
ADMIN_EMAIL=youremail@example.com
ADMIN_PASSWORD=YourStrongPassword123
```

### Frontend

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=94750519450
```

> Important: do not commit `.env` or `.env.local` files to GitHub.

---

## Deployment Notes

- Start the backend and frontend separately in two terminals.
- Ensure MongoDB is running and reachable.
- Update business name, WhatsApp number, and district configuration before deployment.
- Use production-safe admin credentials and JWT secret values.

---

## Default URLs

### Frontend

```text
http://localhost:3000
```

### Backend

```text
http://localhost:5000
```

### API Health

```text
http://localhost:5000/api/health
```

### Admin Login

```text
http://localhost:3000/admin/login
```

---

## Delivery Coverage

The application is configured for Sri Lankan delivery coverage across all 25 districts, with Puttalam set as the default delivery district.

---

## Notes

This project is designed as a practical full-stack seafood e-commerce platform with a real business focus. It is suitable for local business deployment and can be customized by changing business values, catalog data, and admin credentials.

The app is ready for extension with additional features such as advanced order management, payment integration, and stronger multi-language support.
