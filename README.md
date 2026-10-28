# 👑 APPLE KING — Online Storefront

> **Premium Luxury Smartphone & Original Accessories Public Catalog**  
> Independently hosted Next.js 16 application with direct MongoDB Atlas read-only integration and WhatsApp-first customer inquiries.

---

## 📖 Overview

**APPLE KING** is an ultra-fast, luxury-themed, Arabic-first public e-commerce catalog for premium smartphones (Apple iPhone, Samsung Galaxy, certified used devices) and official mobile accessories (chargers, MagSafe cases, cables, power banks).

Unlike traditional web stores, APPLE KING employs a **Catalog-Only & Direct WhatsApp Inquiry** architecture. Customers browse live inventory, select color and storage variants, verify branch-specific availability, and complete purchases directly with dedicated sales representatives via tailored WhatsApp messages.

---

## 🏛️ System Architecture & Decoupling

The storefront operates **independently** from the merchant's physical point-of-sale ERP system.

```text
CUSTOMER'S LOCAL WINDOWS COMPUTER (POS)
---------------------------------------
ERP Frontend (client/)
ERP Backend (server/)
Inventory & Financial Records
Storefront Sync Worker (15s reconciliation)
                  │
                  ▼ (Authorized synchronization)
       MongoDB Atlas Cluster (`erp_phones`)
       Collection: `storefrontproducts`
                  ▲
                  │ (Strict Read-Only queries)
VERCEL SERVERLESS CLOUD
---------------------------------------
APPLE KING Public Storefront (Next.js 16)
App Router • React 19 • Tailwind CSS
                  │
                  ▼
Customers Browsing Catalog & Inquiring via WhatsApp
```

### Architectural Guarantees:
1. **100% Offline ERP Resilience:** If the merchant's physical Windows PC is powered down, offline, or disconnected, the public storefront remains **fully operational** and accessible worldwide on Vercel.
2. **Zero POS Dependencies:** The storefront has no connection to `localhost:5000` or private ERP APIs.
3. **Strict Read-Only Access:** The storefront only connects to MongoDB Atlas using a dedicated, least-privilege database user restricted exclusively to the `find` operation on `erp_phones.storefrontproducts`.
4. **No Financial or Internal Data Exposure:** Sensitive ERP fields (IMEIs, supplier costs, purchase prices, customer records, repair tickets) are filtered at the ERP sync boundary and never exist in `storefrontproducts`.

---

## ⚡ Technology Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Luxury Gold/Onyx Design System
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database Driver:** [MongoDB Node.js Driver (Official)](https://www.mongodb.com/docs/drivers/node/current/)
- **Testing:** [Playwright](https://playwright.dev/) (End-to-End Customer Journeys & Responsive Viewports) & Node Test Runner
- **Language:** TypeScript 5

---

## 🚀 Getting Started

### Prerequisites
- Node.js `20.x` or `22.x` (LTS recommended)
- `npm` (v10 or later)
- MongoDB Atlas read-only connection URI

### Installation

```bash
# Clone the standalone storefront repository
git clone https://github.com/khaledazam/apple-king.git
cd apple-king

# Install dependencies using clean install
npm ci
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory based on `.env.example`:

```bash
cp .env.example .env.local
```

### Required Configuration:

| Variable | Description | Scope |
|---|---|---|
| `STOREFRONT_MONGODB_URI` | Dedicated read-only MongoDB Atlas URI | Server-Side Only (Secret) |
| `STOREFRONT_DB_NAME` | Authoritative database name (`erp_phones`) | Server-Side |
| `STOREFRONT_COLLECTION_NAME` | Catalog collection (`storefrontproducts`) | Server-Side |
| `NEXT_PUBLIC_STORE_NAME` | Brand display title (`APPLE KING`) | Client & Server |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Official Egyptian WhatsApp number (e.g., `201012345678`) | Client & Server |
| `NEXT_PUBLIC_APP_URL` | Canonical deployment URL (e.g., `https://apple-king.vercel.app`) | Client & Server |

> **IMPORTANT:** Never commit `.env` or `.env.local` to Git. Keep `STOREFRONT_MONGODB_URI` restricted to read-only access.

---

## 🛠️ Local Development & Scripts

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run TypeScript compilation and build production bundle
npm run build

# Start production server locally
npm run start

# Run unit and contract test suites
npm test

# Run Playwright responsive viewports QA
npx tsx __tests__/responsive-qa.playwright.ts

# Run Playwright customer journey tests
npx tsx __tests__/customer-journeys.playwright.ts
```

---

## 🛡️ Dedicated MongoDB Atlas Read-Only Setup

The production storefront **must never** use an administrator database account. Follow these steps in the MongoDB Atlas Console:

1. **Create Custom Role:**
   - Database: `erp_phones`
   - Collection: `storefrontproducts`
   - Actions: `find` (Read-only)
   - Role Name: `storefront_readonly_role`
2. **Create Database User:**
   - Username: `storefront_ro_user`
   - Password: `<STRONG_PASSWORD>`
   - Assigned Roles: `storefront_readonly_role@erp_phones`
3. **Connection String:**
   ```text
   mongodb+srv://storefront_ro_user:<STRONG_PASSWORD>@cluster0.xiz8ric.mongodb.net/erp_phones?retryWrites=true&w=majority
   ```

---

## ☁️ Vercel Deployment Instructions

1. **Import Project into Vercel:**
   - Connect your GitHub account and select repository: `khaledazam/apple-king`
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (Leave as default repository root)
   - **Build Command:** `npm run build`
   - **Install Command:** `npm ci`
2. **Configure Environment Variables:**
   - Add all 6 variables from `.env.example` in Vercel Project Settings → Environment Variables.
3. **Deploy:**
   - Deploy to Preview to verify MongoDB Atlas connectivity and public catalog rendering.
   - Promote to Production once verification is complete.

---

## 🔄 Catalog Synchronization Mechanism

Catalog synchronization is managed asynchronously by the merchant's physical ERP backend:
- The ERP background sync worker watches for inventory adjustments (POS sales, stock transfers, price adjustments, intake of certified used phones).
- Clean, public-safe DTOs are written to `erp_phones.storefrontproducts`.
- When stock reaches 0, the item remains published as `out_of_stock` with disabled purchase inquiries and availability waitlist messaging to maintain search engine rankings (SEO).

---

## 📄 License & Security

- Private and proprietary intellectual property of **APPLE KING**.
- All rights reserved. Unauthorized copying or redistribution is strictly prohibited.
