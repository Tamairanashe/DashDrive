# DashDrive Super-App

A comprehensive mobility and logistics platform built for production, featuring City-to-City (C2C) ride-sharing, marketplace negotiation, and real-time fleet operations.

## 📁 Repository Structure

- **`/dashdrive-mobility-backend`**: NestJS + Prisma + PostgreSQL (The core engine).
- **`/mobile-user`**: React Native (Expo) - Passenger experience.
- **`/mobile-host`**: React Native (Expo) - Driver Supply Hub & Execution.
- **`/dashdrive-admin-panel`**: React + Ant Design - Live operations & Finance management.
- **`/infra`**: Docker Compose and Kubernetes manifests for scaling.

## 🚀 Quick Start (Docker)

To run the entire ecosystem (Backend + DB + Admin) in 2 minutes:

```bash
cd infra
docker-compose up --build
```

## 🛠️ Tech Stack

- **Backend**: NestJS, Prisma, Socket.io (Real-time).
- **Mobile**: React Native, NativeWind (Tailwind), Expo.
- **Admin**: React, Framer Motion, Ant Design.
- **Cloud**: Docker, Kubernetes, Nginx.

## 🧪 Modules

### 🏙️ City-to-City (C2C)
- **Marketplace**: Browse scheduled trips with smart ranking `(1/Price) + Seats`.
- **Negotiation**: Live WebSocket-based bidding for passenger requests.
- **Escrow**: Atomic payment reservation and release system.
- **Dynamic Pricing**: 15% automatic premiums based on route scarcity.

---
Built by DashDrive Engineering.
