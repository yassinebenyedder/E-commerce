
# E-Commerce Platform

>A modern, full-stack e-commerce web application built with Next.js, React, MongoDB, and Tailwind CSS.

## Features

- Product catalog with support for multiple variants (size, color, etc.)
- User-friendly checkout flow
- Admin panel for managing products, categories, orders, and promotions
- Authentication for admin users
- Responsive design for desktop and mobile
- Image upload for products and categories
- SEO-friendly and performant
- Shopping cart with persistent session storage (MongoDB)

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, MongoDB (via Mongoose)
- **Authentication:** JWT-based for admin
- **Image Upload:** UploadThing

## Getting Started

1. **Clone the repository:**
	```bash
	git clone https://github.com/yassinebenyedder/E-commerce
	cd e-commerce
	```
2. **Install dependencies:**
	```bash
	npm install
	# or
	yarn install
	```
3. **Configure environment variables:**
	- Copy `.env.example` to `.env.local` and fill in your MongoDB URI and any other secrets.
4. **Run the development server:**
	```bash
	npm run dev
	# or
	yarn dev
	```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Folder Structure

- `src/app` — Next.js app directory (pages, API routes)
- `src/components` — Reusable React components
- `src/models` — Mongoose models (Product, Order, Cart, etc.)
- `src/contexts` — React context providers (e.g., CartContext)
- `src/lib` — Utility libraries (DB connection, auth, upload)

## Customization

- To add product variants, see `PRODUCT_VARIANTS.md` for details.
- Admin panel is available at `/admin` (requires login).

## License

This project is open source and available under the [MIT License](LICENSE).
