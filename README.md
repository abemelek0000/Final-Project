# ግጥም ሲጥም (Gitim Sitim) — Amharic Poetry Community Platform

Web Programming II — Individual Final Project

## 1. Description

**ግጥም ሲጥም** is a full‑stack web application for Amharic poetry lovers. Registered
users can write and publish their own poems, like and comment on other people's
work, and follow poets they enjoy. A public **"የሳምንቱ ምርጥ ግጥም" (Poem of the Week)**
section automatically highlights the poem with the most likes, and a **weekly book
recommendation** section lets admins promote a book to all visitors. Admins get a
dedicated dashboard to moderate poems and manage book recommendations.

The project is built as a **decoupled REST API (Node.js/Express + PostgreSQL)**
consumed by a **vanilla HTML/CSS/JavaScript** frontend — the frontend never talks
to the database directly, it only calls the API over `fetch`.

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Backend framework | Express.js |
| Database | PostgreSQL (via `pg`) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password security | `bcrypt` (salted hashing) |
| Logging | `morgan` (HTTP request logging) |
| Frontend | Vanilla HTML5, CSS3, JavaScript (no framework) |
| Dev tooling | `nodemon`, `dotenv`, `cors` |

## 3. Features

### Core (course requirements)
- **Authentication** — register/login with JWT-based sessions (`/api/auth`).
- **Authorization** — route-level `authenticate` middleware, plus role-based
  `authorizeAdmin` middleware that restricts admin-only endpoints (e.g. deleting
  any poem, managing book recommendations) to users with `role = 'ADMIN'`.
- **Hashing** — passwords are never stored in plain text; `bcrypt.hash()` (10
  salt rounds) is used on registration and `bcrypt.compare()` on login.
- **Logging** — all HTTP requests are logged via `morgan("dev")`.
- **MVC architecture** — `routes/` → `controllers/` → `models/`, with the
  frontend acting as the "View" and talking to the API only.
- **Relational database** — PostgreSQL with 6 related tables .



## 4. Database

The full DDL lives in [`database/schema.sql`](./database/schema.sql), and sample
seed data in [`database/seed.sql`](./database/seed.sql).

**Tables & relationships**

| Table | Purpose | Key relationships |
|---|---|---|
| `users` | Accounts, role (`USER`/`ADMIN`), profile info | referenced by almost every other table |
| `poems` | Poem title/content, source (`USER`/`ADMIN`), view count | `author_id → users.id` |
| `comments` | Comments on a poem | `poem_id → poems.id`, `user_id → users.id` |
| `likes` | One like per user per poem (`UNIQUE(poem_id, user_id)`) | `poem_id → poems.id`, `user_id → users.id` |
| `followers` | Follower/following pairs (`UNIQUE`, no self-follow) | `follower_id / following_id → users.id` |
| `book_recommendations` | Weekly admin-curated book | `created_by → users.id` |

All foreign keys cascade on delete. Constraints (`CHECK`, `UNIQUE`) enforce valid
roles/source types and prevent duplicate likes, duplicate follows, and self-follows
at the database level.

## 5. Project Structure

```
Final Project/
├── client/                # Vanilla HTML/CSS/JS frontend
│   ├── *.html              # home, poems, login, register, profile, admin, about, contact
│   ├── components/         # navbar.js (shared nav)
│   ├── css/style.css
│   └── js/                 # api.js, auth.js, home.js, poems.js, admin.js, ...
├── server/                # Express REST API
│   ├── app.js               # express app + middleware + route mounting
│   ├── server.js            # entry point, connects to Postgres, starts server
│   ├── config/db.js         # pg Pool setup
│   ├── routes/               # one router per resource
│   ├── controllers/          # request handling / response shaping
│   ├── models/                # raw SQL queries (pg)
│   ├── middleware/            # authMiddleware (JWT), adminMiddleware (RBAC)
│   └── .env                 # local environment config (not committed)
└── database/
    ├── schema.sql            # DDL: tables, constraints, relationships
    └── seed.sql              # sample data (admin user)
```

## 6. Setup & Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (v13+ recommended)
- A tool to serve static files for the client (e.g. the VS Code **Live Server**
  extension, or `npx serve`) — opening the HTML files with `file://` directly
  also works, but a local server avoids browser quirks.

### 6.1 Database setup
1. Create a database, e.g.:
   
2. Run the schema, then the seed data:
   

### 6.2 Server setup
1. Move into the server folder and install dependencies:
   
2. Create a `.env` file (or edit the existing one) with:
   ```env
   PORT=5000

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=getemsitem
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password

   JWT_SECRET=some_long_random_secret
   ```
3. Start the API:
   
   The API will be available at `http://localhost:5000/api`.

### 6.3 Client setup
No build step or dependencies needed. From the `client/` folder, serve the
files with any static server (or open `home.html` directly), 
Then visit the printed local URL (or open `home.html` with Live Server). The
frontend is pre-configured to call the API at `http://localhost:5000/api`
(see `client/js/api.js`), so make sure the server is running first.

### 6.4 Getting admin access
`seed.sql` inserts an `admin` account, but its `password_hash` is a placeholder
and not a real bcrypt hash, so it won't log in as-is. The simplest way to get an
admin account for testing:
1. Register a normal account through the UI (`register.html`).
2. Promote it to admin directly in the database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';
   ```
3. Log back in — the "አስተዳዳሪ" (Admin) link will now appear in the nav.

## 7. API Overview

All routes are prefixed with `/api`.

| Resource | Endpoint | Notes |
|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET/PUT /auth/profile` | JWT issued on login |
| Poems | `GET /poems`, `GET /poems/featured`, `GET /poems/mine`, `POST /poems`, `PUT/DELETE /poems/:id`, `POST /poems/:id/view` | `featured` = most-liked poem |
| Likes | `POST /likes/:id` | toggles like/unlike |
| Comments | `GET/POST /comments/:poemId`, `PUT/DELETE /comments/:id` | owner-restricted edit/delete |
| Follows | `POST /follows/:id`, `GET /follows/:id/count` | toggles follow/unfollow |
| Users | `GET /users/search`, `GET /users/:id` | |
| Books | `GET /books`, `GET /books/latest`, `GET /books/:id` | public read |
| Admin | `POST/PUT/DELETE /admin/books/:id`, `DELETE /admin/poems/:id` | requires `role = ADMIN` |

