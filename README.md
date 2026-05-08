# BitIron — Backend API

REST API for BitIron, a fitness e-commerce platform built with Node.js and Express, backed by a MariaDB database.

---

## 🚀 Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 5
- **Database:** MariaDB (via `mysql2`)
- **Auth:** JWT + bcryptjs
- **Validation:** `express-validator` (Centralized pipelines)
- **Testing:** Jest
- **CI/CD:** GitHub Actions
- **Containerization:** Docker & Docker Compose

---

## 🏗️ Advanced Architecture Highlights

This backend is designed with maintainability, robustness, and clean code principles in mind.

### 1. Centralized Error Handling (`catchAsync` & `CustomError`)
We have completely eliminated repetitive `try-catch` blocks across all controllers. Every asynchronous controller is wrapped in a higher-order function (`catchAsync`), which automatically catches promise rejections and forwards them to a global Express error-handling middleware. Custom operational errors are managed via a `CustomError` class, ensuring consistent API error responses (e.g., standardizing status codes and JSON error messages).

### 2. Validation Pipelines (`express-validator`)
Input validation is decoupled from the business logic. We use `express-validator` to declare rules at the route level. A central validation middleware (`validateResult.js`) intercepts the request, checks for schema violations, and immediately returns a `400 Bad Request` with detailed property-level error descriptions if validation fails. This guarantees that controllers only process clean, expected data.

### 3. Fail-Fast Environment Validation
The application uses a strict startup check (`checkEnv.js`). If any critical environment variable (like `DB_PASS` or `JWT_SECRET`) is missing, the Node process halts immediately with exit code `1`. This prevents silent failures or confusing runtime errors in production and CI environments.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ (for local bare-metal development)
- Docker Desktop / Engine & Docker Compose (for containerized deployment)

### Option A: Running with Docker (Recommended)

The easiest way to get the entire stack (API + Database) running without installing local dependencies is using Docker Compose.

1. Clone the repository:
   ```bash
   git clone https://github.com/BitIron/BitIron-Backend.git
   cd BitIron-Backend
   ```
2. Build and spin up the containers in detached mode:
   ```bash
   docker-compose up -d --build
   ```
   *Note: This will automatically spin up the MariaDB container, initialize the schema using `db/init.sql`, and start the Node.js API on port 3000.*

3. To stop the containers:
   ```bash
   docker-compose down
   ```

### Option B: Local Bare-Metal Setup

If you prefer running the Node application directly on your machine:

1. Clone and install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment variables template and configure your values:
   ```bash
   cp .env.example .env
   ```
   Ensure your `.env` contains:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=1234
   DB_NAME=bitiron_db
   DB_PORT=3306
   JWT_SECRET=super_secreto_bitiron_123
   PORT=3000
   ```

3. Initialize the database locally:
   ```bash
   mysql -u root -p < db/init.sql
   ```
   *(Optional)* To populate the database with a premium testing catalog (24 top-tier products like LifePro, Gymshark, Optimum Nutrition):
   ```bash
   mysql -u root -p bitiron_db < db/seed_25_productos.sql
   ```

4. Run the server:
   ```bash
   npm run dev     # Development mode (nodemon)
   npm start       # Production mode
   ```

---

## 📡 API Reference

**Base URL:** `http://localhost:3000/api`

Protected routes require the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/registro` | — | Register a new user |
| POST | `/auth/login` | — | Login and get JWT token |
| GET | `/auth/perfil` | User | Get current user profile |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categorias` | — | List categories (Paginated) |
| GET | `/categorias/:id` | — | Get category by ID |
| POST | `/categorias` | — | Create category |
| PUT | `/categorias/:id` | — | Update category |
| DELETE | `/categorias/:id` | — | Delete category (Blocked if it has associated products) |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/productos` | — | List products (Paginated) |
| GET | `/productos/:id` | — | Get product by ID |
| POST | `/productos` | Admin | Create product |
| PUT | `/productos/:id` | Admin | Update product |
| DELETE | `/productos/:id` | Admin | Delete product |

**Query params for GET collections (Pagination & Filters):**
- `page` (default: 1)
- `limit` (default: 10)
- `nombre` (partial string match)
- `idCategoria`

### Cart & Checkout (Pedidos)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/carrito/:idCliente` | — | Get cart items for a client |
| POST | `/carrito` | — | Add product to cart (Validates stock) |
| DELETE | `/carrito/:id` | — | Remove item from cart |
| POST | `/pedidos/checkout` | — | Convert cart to order (Reduces stock) |
| GET | `/pedidos/cliente/:idCliente` | — | Get paginated order history |

### Advisory Plans (Asesorías)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/planes/generar` | User | Generate personalized training + diet plan |
| GET | `/planes/historial` | User | Get paginated plan history for the logged-in user |

---

## 🗄️ Data Model & Database

The database consists of 8 tables with relational integrity:

```text
CATEGORIA ──< PRODUCTO ──< DETALLE_PEDIDO >── PEDIDO >── CLIENTE
                   │                                        │
                   └──────────── CARRITO >─────────────────┘
                                                            │
                                                        ASESORIA
                                                      LOG_SISTEMA
```

### Stored Procedures
- `sp_aplicar_descuento_marca(p_marca, p_porcentaje)`: Safely applies a percentage discount to all products of a specific brand using a database transaction, and registers the operation inside the `LOG_SISTEMA` table for auditing.

---

## 📁 Project Structure

```text
src/
├── config/         # DB connection pool & environment validation
├── controllers/    # Route handlers (Business logic)
├── middlewares/    # JWT Auth, Global Error Handler
├── models/         # Raw SQL queries (Data access layer)
├── routes/         # Express routers mapping
├── utils/          # Pure functions, CatchAsync utility
└── validators/     # express-validator schemas

tests/
├── integration/    # API endpoints testing
└── unit/           # Business logic utility testing

db/                 # SQL Schemas and Seed Data
```

---

## 🧪 Testing

The project uses `Jest` for both Unit and Integration testing.
GitHub Actions automatically runs the entire test suite on every Push and Pull Request.

To run tests locally:
```bash
npm test
```

---

## 🔀 Gitflow Model

This repository follows a strict Gitflow branching strategy to maintain code stability:

- `main` — Stable production releases.
- `develop` — Integration branch for testing new features.
- `feature/*` — Feature branches.
- `fix/*` — Bug and hotfixes.

All changes must go through a Peer-Reviewed **Pull Request** before being merged into `develop`.

---

## 🔑 Test Credentials

For local development and testing purposes only:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@bitiron.com | Admin1234! |
| **Client** | juan@example.com | Cliente1234! |
| **Client** | ana@example.com | Cliente1234! |
