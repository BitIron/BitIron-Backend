# BitIron — Backend API

REST API for BitIron, a fitness e-commerce platform built with Node.js and Express, backed by a MariaDB database.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MariaDB (via `mysql2`)
- **Auth:** JWT + bcryptjs
- **Validation:** express-validator
- **Testing:** Jest
- **CI:** GitHub Actions

---

## Getting Started

### Prerequisites

- Node.js 18+
- MariaDB / MySQL running locally

### Installation

```bash
git clone https://github.com/BitIron/BitIron-Backend.git
cd BitIron-Backend
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=bitiron_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret
PORT=3000
```

### Database setup

Run the init script to create all tables, constraints, stored procedures and seed data:

```bash
mysql -u root -p < db/init.sql
```

Optionally, load 100 product records for development:

```bash
mysql -u root -p bitiron_db < db/seed_100_productos.sql
```

### Run the server

```bash
npm run dev     # development
npm start       # production
```

---

## API Reference

Base URL: `http://localhost:3000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/registro` | — | Register a new user |
| POST | `/auth/login` | — | Login and get JWT token |
| GET | `/auth/perfil` | User | Get current user profile |

**Login response:**
```json
{
  "token": "eyJ...",
  "usuario": { "id": 1, "nombre": "Juan Garcia", "rol": "cliente" }
}
```

---

### Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categorias` | — | List all categories |
| GET | `/categorias/:id` | — | Get category by ID |
| POST | `/categorias` | — | Create category |
| PUT | `/categorias/:id` | — | Update category |
| DELETE | `/categorias/:id` | — | Delete category (blocked if it has products) |

> **Business logic:** deleting a category that has associated products returns `400`. Products must be reassigned first.

---

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/productos` | — | List products (with filters and pagination) |
| GET | `/productos/:id` | — | Get product by ID |
| POST | `/productos` | Admin | Create product |
| PUT | `/productos/:id` | Admin | Update product |
| DELETE | `/productos/:id` | Admin | Delete product |
| POST | `/productos/descuento` | Admin | Apply % discount to all products of a brand |

**Query params for GET /productos:**

| Param | Example | Description |
|-------|---------|-------------|
| `nombre` | `?nombre=proteina` | Filter by name (partial match) |
| `idCategoria` | `?idCategoria=1` | Filter by category |
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=10` | Items per page (default: 10) |

---

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/carrito/:idCliente` | — | Get cart items for a client |
| POST | `/carrito` | — | Add product to cart |
| PUT | `/carrito/:id` | — | Update item quantity |
| DELETE | `/carrito/:id` | — | Remove item from cart |
| DELETE | `/carrito/clear/:idCliente` | — | Clear entire cart |

> **Business logic:** adding or updating an item checks available stock in the database. Returns `400` if stock is insufficient.

---

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/pedidos/checkout` | — | Convert cart to order (reduces stock) |
| GET | `/pedidos/cliente/:idCliente` | — | Get order history for a client |

---

### Advisory Plans

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/planes/generar` | User | Generate personalized training + diet plan |
| GET | `/planes/historial` | User | Get plan history for the current user |

**Body for POST /planes/generar:**
```json
{
  "disciplina": "musculacion",
  "objetivo": "volumen",
  "nivel": "intermedio",
  "diasEntreno": 4,
  "tipoDieta": "alta en proteinas",
  "nivelSuplementacion": "avanzado",
  "comidasAlDia": 5,
  "horaEntreno": "18:00"
}
```

---

## Data Model

The database consists of 8 tables:

```
CATEGORIA ──< PRODUCTO ──< DETALLE_PEDIDO >── PEDIDO >── CLIENTE
                   │                                        │
                   └──────────── CARRITO >─────────────────┘
                                                            │
                                                        ASESORIA
                                                      LOG_SISTEMA
```

**Stored procedure:** `sp_aplicar_descuento_marca(marca, porcentaje)` — applies a percentage discount to all products of a given brand and logs the operation in `LOG_SISTEMA`.

---

## Testing

Unit tests cover the core business logic utility functions:

```bash
npm test
```

Tests are located in `tests/unit/utils.test.js` and cover:
- Password validation rules
- Stock validation before adding to cart
- Discount percentage validation

GitHub Actions runs the test suite automatically on every push and pull request to `main` and `develop`.

---

## Project Structure

```
src/
├── config/         # Database connection pool
├── controllers/    # Route handlers
├── middlewares/    # Auth middleware, error handler
├── models/         # Database queries
├── routes/         # Express routers
├── utils/          # Pure business logic utilities
└── validators/     # express-validator rules

tests/
└── unit/           # Jest unit tests

db/
├── init.sql        # Schema, constraints, stored procedure and seed data
└── seed_100_productos.sql

.github/
└── workflows/
    └── ci.yml      # GitHub Actions CI pipeline
```

---

## Gitflow

This project follows the Gitflow branching model:

- `main` — stable production releases
- `develop` — integration branch
- `feature/*` — new features
- `docs/*` — documentation changes
- `fix/*` — bug fixes

All changes go through **Pull Requests** with peer review before merging into `develop`.

---

## Test Credentials

For local development only:

| Email | Password | Role |
|-------|----------|------|
| admin@bitiron.com | Admin1234! | admin |
| juan@example.com | Cliente1234! | cliente |
| ana@example.com | Cliente1234! | cliente |
