# Traditional Indian Snacks – Andhra Poornalu Online Ordering Platform 🪔

> **Taste • Tradition • Together**  
> Authentic homemade Andhra-style Poornalu (Poornam Boorelu) crafted by **Lakshmipathi Raju**.

A production-ready full-stack online ordering, customer authentication, SMS OTP, admin dashboard, order management, and order tracking platform built with **React, TypeScript, Vite, Tailwind CSS, and Supabase PostgreSQL with Row Level Security (RLS)**.

---

## 📋 Table of Contents
1. [Business Profile](#-business-profile)
2. [Visual Identity & Design Palette](#-visual-identity--design-palette)
3. [Key Features](#-key-features)
4. [Technology Stack](#-technology-stack)
5. [Database Architecture & Security (RLS)](#-database-architecture--security-rls)
6. [Getting Started & Local Setup](#-getting-started--local-setup)
7. [Supabase Database Migration](#-supabase-database-migration)
8. [Configuring SMS OTP Provider](#-configuring-sms-otp-provider)
9. [Setting Up Authorized Admin Account](#-setting-up-authorized-admin-account)
10. [Free Budget & Cost Advisory](#-free-budget--cost-advisory)
11. [Deployment Guide (Vercel / Netlify / Cloudflare)](#-deployment-guide-vercel--netlify--cloudflare)
12. [Automated Test Suite Verification](#-automated-test-suite-verification)

---

## 🏢 Business Profile
- **Business Name:** Traditional Indian Snacks
- **Special Product:** Andhra Poornalu (Poornam Boorelu)
- **Founder & Master Sweets Chef:** Lakshmipathi Raju
- **Contact Number:** `+91 9948016716`
- **WhatsApp Direct Order Line:** `+91 9948016716`
- **Tagline:** *Taste • Tradition • Together*
- **Origin & Location:** Andhra Pradesh, India
- **Preparation Philosophy:** 100% Homemade, pure cow ghee, dark unadulterated organic jaggery (bellam), fresh grated coconut, slow-cooked chana dal, hand-ground cardamom, and crisp fermented urad-rice shell. Zero chemical preservatives or artificial food coloring.

---

## 🎨 Visual Identity & Design Palette
Reproduces the original traditional Andhra festival poster branding:
- **Warm Cream:** `#FFF3DD`
- **Light Beige:** `#F8E7CB`
- **Deep Maroon:** `#7B211F`
- **Dark Red:** `#9B302A`
- **Antique Gold:** `#C69A45`
- **Brown:** `#553322`

### ⚠️ Strict Food Image Policy
Every single food photograph and illustration on the platform is strictly restricted to **Poornalu / Poornam Boorelu only** (arranged in traditional brass utensils, golden fried spherical shells, authentic cut-open cross-sections revealing sweet lentil & jaggery filling). No unrelated snacks, samosas, laddus, or generic sweets are displayed.

---

## 🚀 Key Features

### 1. Customer Authentication (Supabase Phone OTP)
- Mobile number validation (+91 Indian mobile numbers supported).
- Secure 6-digit SMS OTP verification powered by Supabase Auth.
- Resend OTP with a live 60-second cooldown timer.
- Profile auto-generation in PostgreSQL `profiles` table.
- Zero hardcoded OTPs in production code.
- Resilient local sandbox fallback mode for testing without SMS credits.

### 2. Customer Dashboard & Self-Service Portal (`/customer/dashboard`)
- Personalized welcome greeting with customer name.
- Profile manager: View phone number, update full name and delivery address.
- Interactive order booking modal.
- Active orders counter & complete order history.
- Real-time order progress timeline tracking.

### 3. Order Booking & Pricing Engine
- Automatically prefilled with verified customer credentials.
- Product: Andhra Poornalu (Poornam Boorelu).
- Quantity selector in boxes (10 pcs / box).
- **Honest Pricing:** Displays `"Contact us for price"` initially until admin configures unit price; calculates exact order totals when configured.
- Doorstep Home Delivery vs. Kitchen Self-Pickup selection.
- Preferred date picker & delivery time slots.
- Payment notice: *"Payment will be collected after order confirmation"*.
- Automatic WhatsApp order summary link generator directed to Lakshmipathi Raju (+91 9948016716).

### 4. Live Order Tracking Timeline
- **Order Status Progression:**
  `Pending` → `Confirmed` → `Preparing` → `Ready for Pickup` (Pickup orders) / `Out for Delivery` (Delivery orders) → `Delivered` (or `Cancelled`).
- Live progress indicator with status timestamps and kitchen notes.
- Instant synchronization with admin database updates.

### 5. Secure Admin Console (`/admin`)
- Accessible strictly via authorized admin email: `Admin@gmail.com`.
- Role verification enforced through PostgreSQL `user_roles` table (`role = 'admin'`).
- Non-admin customers cannot access admin routes or escalate privileges.

### 6. Real-Time Admin Dashboard Overview (`/admin/dashboard`)
Real database statistics (never hardcoded / fake numbers):
- **Total Orders**
- **Total Customers**
- **Pending Orders**
- **Confirmed Orders**
- **Preparing Orders**
- **Ready for Pickup Orders**
- **Out for Delivery Orders**
- **Delivered Orders**
- **Cancelled Orders**
- **Total Revenue** calculated strictly from Paid orders

### 7. Full Order Management (`/admin/orders`)
- Filter by status (`Pending`, `Confirmed`, `Preparing`, `Ready for Pickup`, `Out for Delivery`, `Delivered`, `Cancelled`).
- Instant search by Customer Name, Phone Number, or Order Number.
- Actions: Inspect details, Confirm order, Mark preparing, Mark ready for pickup / out for delivery, Mark delivered, Cancel order with confirmation modal.
- Payment control: Mark Paid, Unpaid, or Refunded.
- Direct WhatsApp customer chat button with prefilled order context.

### 8. Customer Management (`/admin/customers`)
- Directory of all registered customers with verified phone numbers.
- Registration dates, total orders counter, and most recent order date.
- Modal drilldown: inspect each customer's full order history.

### 9. Products & Pricing Control (`/admin/products`)
- Configure product price (setting price to `0` displays `"Contact us for price"`).
- Update packaging unit, description, and availability toggle (*Accepting Orders* vs *Kitchen Closed*).

---

## 🛠 Technology Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide Icons, Canvas Confetti.
- **Backend & Database:** Supabase PostgreSQL, Supabase Auth (SMS Phone OTP & Admin Email/Password), Supabase Row Level Security (RLS).
- **Messaging Integration:** WhatsApp Web / App Click-to-Chat API.

---

## 🗄 Database Architecture & Security (RLS)

All SQL tables, triggers, and RLS policies are provided in:
- `supabase/schema.sql` (single consolidated file for SQL Editor)
- `supabase/migrations/20261102_initial_schema.sql`

### Tables
1. **`profiles`**: Linked to `auth.users(id)`. Stores customer name, phone, address, and timestamps.
2. **`user_roles`**: Maps `user_id` to role (`customer`, `admin`). Protected against self-escalation.
3. **`products`**: Stores Andhra Poornalu details, pricing, and stock status.
4. **`orders`**: Stores customer orders, quantities, amounts, delivery details, order status, and payment status.
5. **`order_status_history`**: Audit trail logging every status change with notes and updater ID.

### Row Level Security (RLS) Rules:
- **`profiles`:** Customers can read/update only their own profile; Admins can read all profiles.
- **`user_roles`:** Only Admins can insert/update roles; users can view their own role.
- **`products`:** Public read access; Admin-only write access.
- **`orders`:** Customers can only read and create their own orders (initial status must be `Pending`, initial payment must be `Unpaid`); only Admins can update status and payment.
- **`order_status_history`:** Customers can view audit logs for their own orders; Admins can view all.

---

## 💻 Getting Started & Local Setup

### Prerequisites
- Node.js `v18+` (or `v20+` / `v24+`)
- Git

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/traditional-indian-snacks.git
cd traditional-indian-snacks

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

### Environment Configuration (`.env`)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```
> **Note:** If you run the app without entering Supabase credentials, it automatically launches in **Local Development Sandbox Mode** so you can preview, order, and test all admin features without any external blocker.

```bash
# 4. Start local development server
npm run dev

# 5. Execute automated test suite
npm test

# 6. Build for production
npm run build
```

---

## 🛢 Supabase Database Migration

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, copy its entire contents, and paste it into the SQL Editor.
4. Click **Run**. All 5 tables, indexes, helper functions, triggers, and default product seeds will be created.

---

## 📱 Configuring SMS OTP Provider

To send real SMS OTPs to Indian mobile numbers:
1. In your Supabase Dashboard, go to **Authentication** → **Providers** → **Phone**.
2. Toggle **Enable Phone Provider** ON.
3. Select your SMS provider:
   - **Twilio:** Enter `Account SID`, `Auth Token`, and `Message Service SID`.
   - **MessageBird / Vonage / Fast2SMS:** Enter required API keys.
4. Click **Save**. Supabase now dispatches real 6-digit SMS OTPs whenever customers register or sign in.

---

## 🛡 Setting Up Authorized Admin Account

To securely create your administrator account:
1. In Supabase Dashboard, go to **Authentication** → **Users** → **Add User**.
2. Enter:
   - Email: `Admin@gmail.com`
   - Password: Choose a strong private password.
3. Go to **SQL Editor** and run this SQL query to assign the `admin` role:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'
   FROM auth.users
   WHERE email = 'Admin@gmail.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
4. Now visit `/admin/login` on your application and sign in with `Admin@gmail.com` and your password.

---

## 💰 Free Budget & Cost Advisory

To honor your request to start with a **free budget** and avoid unnecessary fees:
- **Frontend Hosting:** 100% **FREE** on Vercel, Netlify, or Cloudflare Pages.
- **Supabase Backend & PostgreSQL:** 100% **FREE** tier includes 500MB database, 50,000 monthly active users, and free authentication.
- **SMS OTP Delivery Notice:** Telecom carriers charge per SMS. No provider provides infinite free SMS messages. Twilio provides ~$15 initial trial credits for testing. In India, local SMS gateways (e.g., Fast2SMS, MSG91) cost ~₹0.15–₹0.25 per SMS.
- During local testing and before you buy SMS credits, our built-in Sandbox Mode allows seamless verification using test code `123456`.

---

## 🚀 Deployment Guide (Vercel / Netlify / Cloudflare)

### Option 1: Deploy to Vercel (Recommended)
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Traditional Indian Snacks Poornalu platform"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your `traditional-indian-snacks` repository.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key
5. Click **Deploy**. Vercel will build and host your site on an HTTPS URL for free.

### Option 2: Deploy to Netlify
1. Connect your repository on [netlify.com](https://netlify.com).
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Add environment variables and click **Deploy Site**.

---

## 🧪 Automated Test Suite Verification

This repository includes an automated test runner verifying all customer workflows, admin lifecycle operations, and security constraints:

```bash
npm test
```

### Verified Test Cases:
- [x] Customer registration & profile persistence
- [x] Customer profile retrieval
- [x] Customer places Poornalu order with doorstep delivery
- [x] Authentic WhatsApp order summary formatting for `+91 9948016716`
- [x] Customer views order history (isolation check)
- [x] Customer tracks live order status timeline
- [x] Customer updates profile delivery address
- [x] Admin views real database statistics
- [x] Admin searches customers by name and phone
- [x] Admin updates order status lifecycle (`Pending` → `Confirmed` → `Preparing` → `Out for Delivery` → `Delivered`)
- [x] Admin updates payment status to `Paid` and verifies revenue recalculation
- [x] Admin configures product price and toggles availability
- [x] Customer isolation: Customer 2 cannot access Customer 1 orders
- [x] Admin role verification: Non-admin email is denied
- [x] Initial price is `0` so UI displays *"Contact us for price"*

---

## 📜 License
Copyright © 2026 **Traditional Indian Snacks**. Developed for Lakshmipathi Raju. All rights reserved.
