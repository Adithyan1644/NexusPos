# NexusPOS — Modern Retail Point of Sale System

A full-stack, enterprise-grade Point of Sale (POS) and retail management system built with **React + Vite** on the frontend and **Spring Boot 3 + Spring Security (JWT)** on the backend.

---

## ⚡ Features

- **Point of Sale (POS)**: Fast barcode/category search, quick cart calculation, discount presets, tax handling, and instant invoice printing.
- **Inventory Control**: Real-time stock tracking, low-stock threshold alerts, and automated stock-in/out audit logs.
- **Customer & Supplier CRM**: Manage buyer profiles, purchase history, loyalty tiers, credit balances, and vendor catalogs.
- **Purchases & Returns**: Multi-status purchase order tracking, stock replenishment, and customer return workflows.
- **Analytics & Reports**: Visual revenue metrics, sales trends, top-selling items, and transaction history.
- **Security & RBAC**: JWT-based authentication with role-based access control (Super Admin, Manager, Cashier, Inventory, Accountant).
- **Modern UI**: Light/Dark theme switching, responsive command palette (`Ctrl+K`), audio checkout feedback, and modal invoice viewer.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design System (Glassmorphism & Micro-animations)
- **Deployment**: Vercel

### Backend
- **Framework**: Spring Boot 3.3.5 (Java 17)
- **Security**: Spring Security 6 + Stateless JWT
- **Persistence**: Spring Data JPA + Hibernate
- **Database**: H2 (File-based / In-Memory) or PostgreSQL
- **Containerization**: Docker (Eclipse Temurin 17)
- **Deployment**: Render / Railway

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ & npm
- Java JDK 17+
- Maven (or use included `mvnw` / `mvnw.cmd`)

### 1. Backend Setup
```bash
cd backend
./mvnw clean spring-boot:run
```
*The Spring Boot API will start on `http://localhost:8080`.*
*Default H2 console available at: `http://localhost:8080/h2-console`.*

### 2. Frontend Setup
```bash
# In the root directory
npm install
npm run dev
```
*The React app will launch on `http://localhost:5173`.*

---

## 🔐 Default Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `sarah@nexuspos.com` | `password` |

---

## ⚙️ Environment Variables

### Frontend (`.env` / `.env.production`)
```env
VITE_API_URL=https://nexuspos-3saw.onrender.com/api
```

### Backend (`application.properties` / Cloud Env)
```properties
server.port=8080
nexuspos.jwt.secret=9a3f8c7d6e5b4a3f8c7d6e5b4a3f8c7d6e5b4a3f8c7d6e5b4a3f8c7d6e5b4a3f
nexuspos.jwt.expirationMs=86400000
```

---

## 🚢 Deployment

### Frontend (Vercel)
1. Import the repository into [Vercel](https://vercel.com).
2. Root directory: `./`
3. Framework: **Vite**
4. Output directory: `dist`
5. The included `vercel.json` automatically manages single-page application (SPA) routing.

### Backend (Render / Railway / Docker)
1. Connect this repo to [Render](https://render.com) as a **Web Service**.
2. Root directory: `backend`
3. Environment: **Docker** (multi-stage `backend/Dockerfile` builds and exposes port 8080).

---

## 📄 License
This project is licensed under the MIT License.
