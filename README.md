# Preorder Manager

A full-stack admin dashboard for creating, managing, and tracking product preorders. Built as a technical assessment project with a focus on clean architecture, backend-driven data operations, and a polished UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-4.16-teal?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

---

## Project Overview

**Preorder Manager** is a small but complete web application that allows administrators to manage preorder records through two primary screens:

1. **Preorder List Page** — View all preorders with filtering, sorting, pagination, inline status toggling, and delete actions.
2. **Create / Update Page** — A unified form for creating new preorders or editing existing ones with pre-filled values.

All filtering, sorting, and pagination are handled on the **backend** via Prisma and SQLite, ensuring scalable data operations rather than client-only manipulation.

---

## Features

### Preorder List
- **Filter** preorders by All, Active, or Inactive status
- **Sort** by Name, Created At, Starts At, or Ends At (ascending / descending)
- **Pagination** with page navigation and item count display
- **Inline status toggle** — switch Active/Inactive directly in the table with database persistence
- **Delete** preorders with immediate list update
- **Row selection** — individual and select-all checkboxes
- **Empty state** when no records match the current filter

### Create & Update
- Unified form for creating and editing preorders
- Pre-filled fields when editing an existing record
- Fields: Name, Products, Preorder When, Starts At, Ends At, Status
- **Loading state** displayed while saving
- **Back**, **Cancel**, and **Save changes** navigation with redirect to list on success

### API
- RESTful endpoints for full CRUD operations
- `GET /api/preorders` — list with filter, sort, and pagination query params
- `POST /api/preorders` — create a new preorder
- `GET /api/preorders/[id]` — fetch a single preorder
- `PUT /api/preorders/[id]` — update a preorder
- `DELETE /api/preorders/[id]` — delete a preorder

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router, Server Components, and API Routes |
| **TypeScript** | Type-safe development across the entire codebase |
| **Prisma 4** | ORM for database schema management and queries |
| **SQLite** | Lightweight file-based database for local development |
| **Tailwind CSS 3** | Utility-first CSS for responsive, consistent styling |
| **React 18** | UI component library |

---

## Installation

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later

### Clone & Install

```bash
git clone https://github.com/mdsamimprogramer/preorder-manager.git
cd preorder-manager
npm install
```

`npm install` automatically runs `prisma generate` via the `postinstall` script.

---

## Environment Variables

This project uses SQLite with a file-based database configured directly in `prisma/schema.prisma`. No `.env` file is strictly required for local development.

For optional configuration, create a `.env` file in the project root:

```env
# Optional — used for absolute URL generation
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional — fallback base URL
NEXTAUTH_URL=http://localhost:3000

# Optional — override SQLite database path
DATABASE_URL="file:./dev.db"
```

> **Note:** If you set `DATABASE_URL` in `.env`, update `prisma/schema.prisma` to use `env("DATABASE_URL")` instead of the hardcoded path.

---

## Prisma Setup

Generate the Prisma Client after any schema change:

```bash
npx prisma generate
```

Open Prisma Studio to browse and edit data visually:

```bash
npx prisma studio
```

---

## Database Migration

### Initial Setup (Push Schema)

For development, push the schema directly to the database without migration files:

```bash
npx prisma db push
```

### Using Migrations (Recommended for Production)

Create and apply migration files:

```bash
# Create a new migration
npx prisma migrate dev --name init

# Apply pending migrations in production
npx prisma migrate deploy
```

The SQLite database file is created at `prisma/dev.db` after the first push or migration.

---

## Seed Data

Populate the database with 8 sample preorders matching the assessment UI:

```bash
npm run seed
```

Or run directly:

```bash
node prisma/seed.mjs
```

> **Warning:** The seed script clears all existing preorder records before inserting sample data.

---

## Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Routes

| Route | Description |
|---|---|
| `/` | Home page with navigation links |
| `/preorders` | Preorder list with filter, sort, and pagination |
| `/preorders/create` | Create a new preorder |
| `/preorders/[id]` | Edit an existing preorder |

---

## Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The production server runs on [http://localhost:3000](http://localhost:3000) by default.

### Full Production Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run seed        # optional
npm run build
npm start
```

---

## Project Structure

```
preorder-manager/
├── prisma/
│   ├── schema.prisma          # Database schema (Preorder model)
│   ├── dev.db                 # SQLite database file (generated)
│   └── seed.mjs               # Seed script with sample data
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── preorders/
│   │   │       ├── route.ts           # GET (list) + POST (create)
│   │   │       └── [id]/route.ts      # GET, PUT, DELETE by ID
│   │   ├── preorders/
│   │   │   ├── page.tsx               # List page (server component)
│   │   │   ├── create/page.tsx        # Create page
│   │   │   └── [id]/page.tsx          # Edit page (server component)
│   │   ├── globals.css                # Global styles + Tailwind directives
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Home page
│   ├── components/
│   │   ├── preorder/
│   │   │   ├── CreatePreorderClient.tsx  # Create form + header logic
│   │   │   ├── EditPreorderClient.tsx    # Edit form + header logic
│   │   │   ├── PreorderForm.tsx          # Shared form component
│   │   │   └── PreorderTable.tsx         # List table with interactions
│   │   └── ui/
│   │       ├── button.tsx                # Reusable button component
│   │       └── icons.tsx                 # SVG icon components
│   ├── lib/
│   │   ├── prisma.ts                     # Prisma client singleton
│   │   └── url.ts                          # URL helper utilities
│   ├── services/
│   │   └── preorder.service.ts           # Database query layer
│   └── types/
│       └── preorder.ts                   # TypeScript interfaces & helpers
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

### Architecture Notes

- **Server Components** fetch data on the list and edit pages for optimal performance.
- **Client Components** handle interactive UI (form submission, table actions, toggles).
- **Service layer** (`preorder.service.ts`) centralizes all Prisma queries.
- **API Routes** expose REST endpoints used by client-side mutations.
- **Types** (`preorder.ts`) define shared interfaces and normalization helpers.

---

## Author

**Md Samim Hosen**

| | |
|---|---|
| Phone | [01743282144](tel:01743282144) |
| Portfolio | [samim01-portfolio.netlify.app](https://samim01-portfolio.netlify.app/) |
| GitHub | [mdsamimprogramer](https://github.com/mdsamimprogramer) |
| LinkedIn | [samim01](https://www.linkedin.com/in/samim01/) |

---

## License

This project is private and was created as part of a technical assessment.
