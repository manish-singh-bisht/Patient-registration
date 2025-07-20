# Patient-registration

This is a **frontend-only** patient registration app.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Local Setup](#local-setup)
- [Usage](#usage)

## Demo

Check out the demo:

https://github.com/user-attachments/assets/2a2b033e-644d-476b-b45b-a697e42e657d

## Features

- Patient registration form and record management.
- Uses browser storage via [PGlite](https://github.com/electric-sql/pglite).
- Multi-tab support with data syncing.
- Persistent local storage (data remains after page reloads).
- Raw SQL query support.

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

## Usage

1. To register a new patient, click on the top right "Register Patient" button and fill the form.
2. To use raw sql query, in the top right click on the "Run SQL" button and run the query you want to run.
