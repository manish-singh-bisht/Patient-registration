# Patient-registration

This is a **frontend-only** patient registration app.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Local Setup](#local-setup)

## Demo

Check out the live demo:

## Features

- Patient registration form and record management
- Uses browser storage via [PGlite](https://github.com/electric-sql/pglite)
- Multi-tab support with data syncing
- Persistent local storage (data remains after page reloads)
- Raw SQL query support

## Local Setup

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/Patient-registration.git
cd Patient-registration

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start the development server
pnpm run dev
```
