# 99 MALL — bilingual multi-category e-commerce starter (v2)

Includes a responsive Hindi/English storefront, category/search filters, demo product catalogue, cart, customer sign-up/login, admin product management, admin order listing/status updates, Supabase database/RLS schema, server-side order creation using trusted product prices, Razorpay signature verification endpoint and webhook endpoint.

## Run locally
1. Install Node.js 20+.
2. Extract ZIP; in the project folder run `npm install`.
3. Copy `.env.example` to `.env.local` and fill values.
4. Run `npm run dev`; open http://localhost:3000.

## Supabase setup
1. Create a project at https://supabase.com.
2. Copy Project URL and anon key to `.env.local`.
3. Run `supabase/schema.sql` in SQL Editor.
4. Create your owner account using `/account` (or Supabase Auth).
5. In Supabase SQL Editor, grant the account admin role:
   `insert into public.profiles(id,role) values ('YOUR_AUTH_USER_UUID','admin');`
6. Add products from `/admin`. Set up your admin profile before attempting admin actions.
7. Add `SUPABASE_SERVICE_ROLE_KEY` to server environment only. Never use NEXT_PUBLIC_ for it.

## Razorpay setup
1. Apply for and verify a merchant account at https://razorpay.com.
2. Add TEST credentials to `.env.local`: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
3. Configure webhook URL: `https://YOUR_DOMAIN/api/payment/webhook`, subscribe to `payment.captured`, and use the webhook secret.
4. The checkout API requires a signed-in customer and recalculates prices from the database. Payment UI/SDK handoff still needs to be wired to the returned Razorpay order details in the cart page before taking payments.
5. Do not enable live payments until the complete checkout handoff, stock reservation/decrement, refund/cancellation, failure handling and webhook reconciliation are tested.

## Deployment and domain
Deploy to Vercel, set environment variables, then connect your registered domain in Vercel and configure DNS at the registrar. Domain availability/purchase must be checked live with the registrar.

## Production launch checklist — required
This repository is a development starter, not a finished production commerce platform. Before accepting real orders, implement and test:
- Razorpay Checkout JS handoff from cart page, client payment response verification, and webhook idempotency.
- Atomic stock decrement/reservation to prevent overselling (current route checks stock but does not reserve it).
- Customer order history/details/tracking and order-item view.
- Image upload to private/controlled Supabase Storage; validate image URLs.
- Address book, shipping fees, tax/GST invoices, pincode/serviceability, cancellation/refund flow.
- Rate limiting, bot protection, input validation, audit logs, error monitoring, backups and security review.
- Privacy policy, terms, shipping/return/refund policies, customer support contacts and legal seller details.
- End-to-end tests for login, products, checkout, payment success/failure, duplicate webhooks and stock contention.

## Security notes
Service-role key and Razorpay secret must remain server-side. Never treat a browser redirect as proof of payment. Only a verified server signature/webhook can confirm payment. The sample schema policies provide basic separation; review them with a developer before launch.
