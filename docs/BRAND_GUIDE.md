# DashDrive Brand Guide

## App Overview

**DashDrive** is a premium ride-hailing and logistics application. The ecosystem includes high-performance consumer apps and enterprise-grade management portals.

---

## 🏛️ Admin & Management Systems (Eats Manager)

The following standards apply to all Admin Dashboards, Merchant Portals, and Support Tools.

### Color Palette (Monochrome & Zinc)

| Name | Hex/Class | Usage |
|------|-----------|-------|
| **Primary** | `zinc-900` | CTAs, active states, headers |
| **Background** | `zinc-50` | Main application background |
| **Surface** | `white` | Cards, sidebars, header blocks |
| **Border** | `zinc-200` | Subtle dividers and card edges |
| **Muted** | `zinc-500` | Secondary labels, disabled states |

### Status Colors (Functional)

- **Success**: `emerald-600` (Success states, positive trends)
- **Warning**: `amber-500` (Ready status, low inventory)
- **Error**: `red-600` (Disconnection, critical alerts)
- **Info**: `blue-600` (System logs, feature updates)

---

## 📱 Consumer Mobile App (Rider/Customer)

| Name | Hex | Usage |
|------|-----|-------|
| **Core Primary** | `#00ff90` | CTAs, highlights |
| **Secondary** | `#000000` | Headers, dark mode backgrounds |
| **Accent Gray** | `#adadad` | Subdued text |

---

## 🔠 Typography

| System | Primary Font | Usage |
|--------|--------------|-------|
| **Admin Portals** | **Inter** | Clean, highly legible for data-heavy views |
| **Mobile App** | **UberMove** | Bold, premium branding and identity |

---

## 🏗️ UI Component Specifications (Admin)

### Buttons
- **Primary**: `bg-zinc-900 text-white rounded-lg hover:shadow-md`
- **Secondary**: `bg-zinc-100 text-zinc-900 shadow-none`
- **Outline**: `border border-zinc-200 bg-white hover:bg-zinc-50`
- **Ghost**: `text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900`

### Cards
- **Radius**: `rounded-xl`
- **Shadow**: `shadow-sm shadow-black/5`
- **Border**: `border border-zinc-200`

### Layout Patterns
- **Sidebar**: Fixed `w-64` (desktop) or `w-20` (collapsed).
- **Glassmorphism**: Use `bg-white/80 backdrop-blur-md` for headers.
- **Micro-interactions**: Use `transition-all duration-200` for hover states.

---

## 🛠️ Technical Stack (Marketplace Standard)

- **Framework**: React / Next.js / Vite
- **Styling**: Tailwind CSS v4 (using `@theme` for Inter sync)
- **Icons**: Lucide React
- **Animations**: Framer Motion (use `AnimatePresence` for tab switches)
- **Data Viz**: Recharts (use Zinc-900 for primary series)
