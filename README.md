# 🏍️ Satyam Motor Parts & Service Management System

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express-v5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)

An enterprise-ready, full-stack **MERN** (MongoDB, Express.js, React, Node.js) web application designed for motorcycle and two-wheeler spare parts dealerships and service workshops. It unifies e-commerce spare parts purchasing, workshop service scheduling, inventory tracking, invoice generation, customer inquiries, and business analytics into a seamless, role-based platform.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Customer Portal](#-customer-portal)
  - [Owner & Shop Manager Portal](#-owner--shop-manager-portal)
  - [Admin Control](#-admin-control)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Database Seeding](#database-seeding)
  - [Running the Application](#running-the-application)
- [Default Demo Credentials](#-default-demo-credentials)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Satyam Motor Parts** bridges the gap between walk-in two-wheeler repair shops and modern digital commerce. Customers can browse authentic spare parts, place orders, book workshop servicing, and track repairs in real-time. Shop owners receive a centralized cockpit to manage parts inventory, handle offline/online billing, track service bays, view financial analytics, and communicate with customers via an interactive inquiry desk.

---

## ⚡ Key Features

### 👤 Customer Portal
- **Browse & Filter Parts:** Filter spare parts across categories: *Engine Parts, Brakes, Electrical, Body Parts, Tyres, Oils & Lubricants, Accessories*.
- **Live Search & Discounts:** Instant search by keyword with discount badges and real-time stock status.
- **Cart & Seamless Checkout:** Manage cart items with quantities; supports Cash on Delivery (COD), UPI, Card, and Online payments.
- **Service Appointment Booking:** Book bike servicing with vehicle type, registration number, preferred time slot, and special requests.
- **Service Tracking:** Real-time visibility into booking status (`Pending`, `Approved`, `In-Progress`, `Completed`, `Cancelled`).
- **Support & Enquiry Desk:** Threaded customer-to-shop inquiry system for fast resolution of product or service questions.
- **Profile & Delivery Address:** Manage personal contact details and delivery addresses.

### 🛠️ Owner & Shop Manager Portal
- **Executive Analytics Dashboard:**
  - Real-time sales metrics (Today, This Month, This Year).
  - 7-day revenue trend chart powered by **Recharts**.
  - Low-stock alerts (`< 5` units remaining) and active booking counters.
- **Inventory & Product Management:**
  - Add, update, and remove spare parts.
  - Multipart image upload via **Multer**.
  - Stock level adjustments and pricing controls.
- **Service Bay Management:**
  - View incoming repair appointments.
  - Update status (`Approved`, `In-Progress`, `Completed`) with custom mechanic notes.
- **Billing & Point-of-Sale (POS):**
  - Create online and walk-in offline customer orders.
  - Automatic GST calculation and printable professional invoices.
- **Customer Support Portal:** Reply directly to customer inquiries in a threaded view.

### 🛡️ Admin Control
- **User & Role Administration:** View all registered customers, owners, and administrators.
- **System-Wide Oversight:** Manage inventory, system logs, and booking schedules across branches.

---

## 📐 System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend (React 19 + Context API)"]
        UI[Responsive Modern UI]
        AuthCtx[Auth Context + JWT]
        CartCtx[Cart Context]
        AxiosClient[Axios API Client]
        UI --> AuthCtx
        UI --> CartCtx
        AuthCtx --> AxiosClient
        CartCtx --> AxiosClient
    end

    subgraph Backend["Backend (Node.js + Express 5)"]
        Router[Express Router]
        AuthMW[Auth & Role-Based Middleware]
        UploadMW[Multer File Storage]
        
        subgraph Controllers
            AuthCtrl[Auth Controller]
            ProdCtrl[Product Controller]
            BookCtrl[Booking Controller]
            OrderCtrl[Order & Billing Controller]
            EnqCtrl[Enquiry Controller]
            DashCtrl[Dashboard Analytics Controller]
        end

        AxiosClient --> Router
        Router --> AuthMW
        AuthMW --> Controllers
        Router --> UploadMW
    end

    subgraph Database["Database (MongoDB Atlas)"]
        Users[(Users Collection)]
        Products[(Products Collection)]
        Bookings[(Bookings Collection)]
        Orders[(Orders Collection)]
        Enquiries[(Enquiries Collection)]
        
        Controllers --> Database
    end
```

---

## 💻 Tech Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **React 19** | Component-based modern UI library |
| **React Router v7** | Client-side routing with role-based protected routes |
| **Axios** | HTTP client with automatic JWT header injection & 401 handling |
| **Recharts** | Interactive SVG charts for dashboard revenue analytics |
| **React Icons** | Clean iconography across dashboards and navigation |
| **Pure CSS3** | Custom responsive styling with glassmorphism and modern UI accents |

### **Backend**
| Technology | Description |
| :--- | :--- |
| **Node.js** | Server-side JavaScript runtime environment |
| **Express.js v5** | Fast, minimalist web framework for RESTful APIs |
| **MongoDB & Mongoose v9** | NoSQL database with schema-based object modeling |
| **JSON Web Tokens (JWT)** | Stateless authentication and role-based access tokens |
| **Bcrypt.js** | Salted password hashing |
| **Multer** | Multipart form-data handling for product image uploads |
| **CORS & Dotenv** | Cross-origin resource sharing & environment configuration |

---

## 📂 Project Directory Structure

```text
Satyam-Motor-Parts/
├── backend/
│   ├── api/
│   │   └── index.js             # Vercel serverless entrypoint
│   ├── config/
│   │   └── db.js                # MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js    # Register, login, user profile
│   │   ├── bookingController.js # Service booking management
│   │   ├── dashboardController.js # Analytics & revenue metrics
│   │   ├── enquiryController.js # Support ticket threads
│   │   ├── orderController.js   # Order processing & billing
│   │   ├── productController.js # Product CRUD & image handling
│   │   └── userController.js    # User management
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification & role guard
│   │   └── uploadMiddleware.js  # Multer disk storage configuration
│   ├── models/
│   │   ├── Booking.js           # Workshop service schema
│   │   ├── Enquiry.js           # Support ticket schema
│   │   ├── Order.js             # Order & billing schema
│   │   ├── Product.js           # Spare parts catalog schema
│   │   └── User.js              # User & role schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── enquiryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/                 # Static storage for product pictures
│   ├── seed.js                  # Database seeder script
│   ├── server.js                # Main Express server entry
│   ├── vercel.json              # Vercel serverless deployment config
│   └── package.json
├── frontend/
│   ├── public/                  # Public assets, favicon, manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerLayout.js
│   │   │   ├── OwnerLayout.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── Sidebar.js
│   │   ├── context/
│   │   │   ├── AuthContext.js   # Global auth state & token storage
│   │   │   └── CartContext.js   # Global shopping cart state
│   │   ├── pages/
│   │   │   ├── admin/           # Admin dashboard views
│   │   │   ├── auth/            # Login & Register views
│   │   │   ├── customer/        # Catalog, Cart, Book Service, History, Enquiries
│   │   │   ├── owner/           # POS Billing, Bookings, Dashboard, Orders, Products
│   │   │   └── Home.js          # Public landing page
│   │   ├── services/
│   │   │   └── api.js           # Axios instance & interceptors
│   │   ├── App.js               # Route routing configuration
│   │   └── index.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/auth/profile` | Private | Get authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user details & address |

### 📦 Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products (with category/search filters) |
| `GET` | `/api/products/:id` | Public | Get single product details |
| `POST` | `/api/products` | Owner, Admin | Create product with image upload |
| `PUT` | `/api/products/:id` | Owner, Admin | Update product details/stock |
| `DELETE` | `/api/products/:id` | Owner, Admin | Delete a product |

### 🏍️ Workshop Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Customer | Create a new service appointment |
| `GET` | `/api/bookings/my` | Customer | List current user's booking history |
| `GET` | `/api/bookings` | Owner, Admin | List all workshop bookings |
| `PATCH` | `/api/bookings/:id/status`| Owner, Admin | Update service status (`approved`, `in-progress`, etc.) |

### 🧾 Orders & POS Billing (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Private | Create an order (Online / Walk-in) |
| `GET` | `/api/orders/my` | Customer | Get customer's orders |
| `GET` | `/api/orders` | Owner, Admin | View all system orders |
| `PATCH` | `/api/orders/:id/status` | Owner, Admin | Update order status |

### 💬 Inquiries & Support (`/api/enquiries`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/enquiries` | Customer | Submit a new inquiry |
| `GET` | `/api/enquiries/my` | Customer | View customer's inquiry threads |
| `GET` | `/api/enquiries` | Owner, Admin | View all customer inquiries |
| `POST` | `/api/enquiries/:id/reply`| Private | Add reply to an inquiry thread |

### 📊 Dashboard & Metrics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | Owner, Admin | Get revenue stats, stock alerts & 7-day chart data |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) (v9.x or later)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB server running.

---

### Installation & Setup

#### 1. Clone the repository
```bash
git clone https://github.com/Satyam00237/Satyam-Motor-Parts.git
cd Satyam-Motor-Parts
```

#### 2. Backend Configuration
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (you can copy `.env.example`):
```bash
cp .env.example .env
```

Configure your environment variables in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/satyam-motor-parts?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

#### 3. Frontend Configuration
Open another terminal, navigate to the `frontend` directory, and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory (you can copy `.env.example`):
```bash
cp .env.example .env
```

Set the API endpoint:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 🌿 Database Seeding
To populate initial catalog products, an owner account, and an admin account:

```bash
cd backend
npm run seed
```

This clears old demo data and populates:
- 10 authentic motorcycle spare parts (Brembo pads, Bosch spark plugs, Motul oil, etc.)
- Owner account
- Admin account

---

### 🏃 Running the Application

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

2. **Start Frontend Client:**
   ```bash
   cd frontend
   npm start
   ```
   *The app will automatically open at `http://localhost:3000`.*

---

## 🔑 Default Demo Credentials

After running `npm run seed`, you can immediately sign in using:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Shop Owner** | `owner@satyam.com` | `Owner@123` | Full Inventory, POS Billing, Analytics, Bookings |
| **Administrator** | `admin@satyam.com` | `Admin@123` | User Oversight, Bookings, System Admin |
| **Customer** | *Self-register at `/register`* | *Your choice* | Catalog, Cart, Book Service, Inquiries |

---

## 🌐 Deployment

### Vercel Serverless Deployment
The repository is structured to deploy smoothly to **Vercel**:
- Backend includes `vercel.json` routing all `/api/(.*)` requests through `api/index.js`.
- Set your environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) inside your Vercel Project Settings.
- Frontend includes responsive configurations and proxy fallbacks for seamless production deployment.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">
  <b>Built with ❤️ by <a href="https://github.com/Satyam00237">Satyam</a></b><br>
  <i>Empowering Motorcycle Workshops with Modern Digital Solutions</i>
</div>
