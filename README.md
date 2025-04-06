# Report Handling System

This repository contains the source code for the **Report Handling System**, a web application built with **Next.js**, **TypeScript**, and **Prisma**. The system provides filtering, sorting, and pagination functionalities to manage reports efficiently.

## 🚀 Features

- Report submission form for user and admin
- Admin UI to manage reports with filtering, sorting and pagination
- REST API integration
- PostgreSQL database via Prisma ORM
- User Authentication with JWT 

---

## 🛠 Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/kenpegrasio/report-handling-system.git
cd report-handling-system
```

### 2. Install dependencies

```bash
npm install
```

---

## ⚙️ Configuration

### 3. Setup Environment Variables

- Create a `.env` file in the root directory.
- Copy the content from `.env.example` and update values as needed.

```bash
cp .env.example .env
```

Edit `.env` to match your PostgreSQL setup:

```
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<your_database>
```

---

## 🧱 Database Setup

### 4. Run Prisma Migrations

```bash
npx prisma migrate dev --name init
```

> This will create the database tables based on your Prisma schema.

### 5. Seed the Database

```bash
npx prisma db seed
```

> This will populate the database with an initial set of data.

---

## 🧪 Run the App

### 5. Start the Development Server

```bash
npm run dev
```

Open your browser and go to: [http://localhost:3000](http://localhost:3000)
