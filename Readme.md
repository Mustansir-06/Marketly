# Marketly — Authentication & Product CRUD Marketplace

A full-stack e-commerce marketplace built for the Sheryians Coding School assignment: **JWT Access + Refresh Tokens, Product CRUD APIs & Frontend with Express Validator** — extended with a shopping cart, checkout flow, and an AI shopping assistant.

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), TypeScript
**Frontend:** React, TypeScript, Vite, Tailwind CSS, react-router (data APIs), react-hook-form, Context API
**Auth:** JWT (access + refresh tokens), bcryptjs, httpOnly cookies
**Validation:** express-validator
**File uploads:** Multer + ImageKit
**AI:** Groq SDK (LLM-powered shopping assistant, grounded in real product data)

## Features

### Authentication
- Register, login, refresh-token, logout, and "me" endpoints
- Short-lived JWT access tokens (returned in response body) + long-lived refresh tokens (httpOnly cookie, persisted server-side for revocation)
- Passwords hashed with bcrypt; refresh token rotation and reuse detection
- Rate limiting on login to prevent brute-force attempts

### Roles
- Every user registers with role `user` by default
- A user can be manually promoted to `seller` (in the database) to gain the ability to create, update, and delete products
- Route-level and ownership-level authorization: a seller can only edit/delete their own listings

### Products
- Full CRUD for products, with two categories:
  - **Clothing** — stock tracked per size (XS–XXL)
  - **General** — a single flat stock number
- Image upload (up to 3 images per product) via Multer + ImageKit
- Public browsing (search, sort by price/date, pagination) — no login required
- Seller-only "My Products" view with edit/delete

### Cart & Checkout
- One cart per user; sellers cannot add their own products to their cart
- Real stock validation on add-to-cart and at checkout (size-aware for clothing)
- Checkout reduces actual product stock in the database and empties the cart
- No payment gateway integration — checkout is a real stock-reduction action, not a simulated one

### AI Shopping Assistant
- Available to logged-in users via a chat widget
- Restricted to store-related questions only (refuses off-topic queries)
- Grounded in real product data: searches the actual product catalog based on the user's message before generating a response, so it never invents a product that doesn't exist
- Conversation memory lasts for the browser session only (cleared on reload) — no chat history is stored server-side

## Project Structure

```
/backend
  /src
    /config        - environment/config loader
    /controllers    - route handlers (auth, products, cart, assistant)
    /middleware     - auth, role authorization, validation, rate limiting
    /models         - Mongoose schemas (User, Product, Cart)
    /routes         - Express routers
    /services       - ImageKit upload, Groq client
    /validators     - express-validator rule chains
    app.ts
    server.ts
/frontend
  /src
    /common         - Home, About, NotFound
    /components     - Navbar, Footer, ProductCard, Pagination, AssistantWidget, etc.
    /context        - AuthContext (Context API, no Redux)
    /layouts        - AuthLayout, MainLayout, protected route wrappers
    /pages
      /auth         - Login, Register
      /products     - ProductList, ProductDetail, ProductForm, MyProducts
      Cart.tsx, CheckoutSuccess.tsx
    /services       - axios instance with token + refresh interceptors
    /types          - shared TypeScript interfaces
    App.tsx
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`) with:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev      # start in development
npm run build    # compile TypeScript
npm start        # run compiled build
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new user account |
| POST | `/login` | Public (rate-limited) | Authenticate, issue access + refresh tokens |
| POST | `/refresh-token` | Requires valid refresh token | Issue a new access token |
| POST | `/logout` | Authenticated | Invalidate the refresh token |
| GET | `/me` | Authenticated | Return the logged-in user's profile |

### Products — `/api/products`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Seller only | Create a product (multipart, up to 3 images) |
| GET | `/` | Public | List products (search, sort, pagination) |
| GET | `/my-products` | Seller only | List the logged-in seller's own products |
| GET | `/:id` | Public | Get a single product |
| PUT | `/:id` | Seller only, owner only | Update a product |
| DELETE | `/:id` | Seller only, owner only | Delete a product |

### Cart — `/api/cart`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Authenticated | Get the current user's cart |
| POST | `/items` | Authenticated | Add an item to the cart |
| PUT | `/items/:itemId` | Authenticated | Update an item's quantity |
| DELETE | `/items/:itemId` | Authenticated | Remove an item from the cart |
| POST | `/checkout` | Authenticated | Validate stock, reduce it, and clear the cart |

### Assistant — `/api/assistant`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/chat` | Authenticated | Send a message to the store assistant |

## Notes on Design Choices

- **Sellers** are a manually-promoted role, not a signup-time choice — new accounts always start as `user`.
- **Clothing vs. general products** are modeled differently on purpose: clothing tracks stock per size, general products track a single stock count — matching how these products are actually sold.
- **Checkout** is scoped to real stock reduction only; no payment gateway or order-history model was built, since that would be outside the scope of what could be honestly implemented and verified here.
- **The AI assistant** always searches the real product database before answering, and is explicitly instructed never to reference a product that isn't in that result set.