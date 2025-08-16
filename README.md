# Fairshare

A smart expense splitter for groups having multiple payers with optimized debt settlement and reminders.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://fairshare.adityakirti.tech)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue?style=for-the-badge)](https://github.com/addy118/fairshare)

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture & Core Concepts](#architecture--core-concepts)
  - [High-Level Architecture](#high-level-architecture)
  - [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Challenges Faced](#challenges-faced)
- [Future Scope](#future-scope)
- [Contributing](#contributing)
- [License](#license)

## The Problem

Managing shared expenses among friends or groups often becomes chaotic, especially when a single expense is paid by multiple people unequally and many such expenses are involved. Tracking who owes whom and ensuring fair settlement can be complex and lead to confusion.

## The Solution

Fairshare simplifies group expenses and debt tracking using a smart algorithm and group-based event flows. It provides a clear, transparent, and efficient way to manage shared finances, reducing the number of transactions required for settlement and ensuring everyone is on the same page.

## Key Features

- **Multi-Payer Expense Splitting**: Easily split expenses that were paid by multiple people unequally among all group members.
- **Optimized Debt Settlement**: Utilizes a cash flow algorithm that minimizes the total number of transactions required to settle all debts within a group, reducing transaction chains by up to 60%.
- **Two-Way Settlement Confirmation**: A secure confirmation mechanism where both the payer and receiver must confirm a settlement before a debt is marked as paid.
- **Transparent History**: Complete and transparent history of all expenses and settlements is available to every member of the group.
- **PDF Export**: Export the entire expense and settlement history of a group as a PDF for easy sharing and record-keeping.
- **In-App UPI Payments**: Seamlessly settle debts using UPI directly within the app, streamlining the payment process.

## Tech Stack

| Frontend                              | Backend    | Database   | Other  |
| :------------------------------------ | :--------- | :--------- | :----- |
| React.js                              | Node.js    | PostgreSQL | Clerk  |
| Modern Redux Toolkit (with RTK Query) | Express.js | Prisma ORM | Vercel |
| Tailwind CSS                          | TypeScript |            |        |
| ShadCN UI                             |            |            |        |
| JavaScript                            |            |            |        |

## Architecture & Core Concepts

The application is built on a robust architecture designed for scalability and efficiency. Below are some of the core diagrams illustrating the system's design.

### High-Level Architecture

This diagram provides an overview of the system's components and their interactions.
![High Level Architecture](https://cdn.jsdelivr.net/gh/addy118/portfolio@master/public/seq-diagrams/fairshare/fs-high-arch.svg)

### Database Schema

The database schema is designed using Prisma and visualized below as an Entity-Relationship Diagram (ERD).
![Database Schema](https://cdn.jsdelivr.net/gh/addy118/portfolio@master/public/schemas/fairshare-erd.svg)

For a deeper dive into the core logic, you can explore these detailed diagrams in the project repository:

- **Cash Flow Algorithm**: How debts are optimized to reduce transactions.
- **Split Calculation**: The logic behind calculating splits for an expense.
- **Expense Creation Flow**: Sequence diagram for creating a new expense.
- **Settlement Confirmation Flow**: Sequence diagram for the two-way settlement process.
- **Clerk Integration**: How Clerk's user management is integrated.

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- **Node.js** (v16 or newer)
- **npm** or **Yarn**
- **PostgreSQL** database
- **Docker** (Optional)
- **Clerk** account for authentication keys.

### Installation

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- **Node.js** (v16 or newer)
- **npm** or **Yarn**
- **PostgreSQL** database running locally.

---

### 1. Server Setup

First, let's get the backend server running.

#### Environment Variables

1.  Navigate to the server directory:
    ```bash
    cd fair-share-server
    ```
2.  Create a new file named `.env` in the `fair-share-server` directory.
3.  Copy the following content into the `.env` file and replace the placeholders with your actual credentials.

    ```env
    # Clerk Authentication - Get these from your Clerk Dashboard
    CLERK_PUBLISHABLE_KEY=pk_test_your_new_clerk_publishable_key
    CLERK_SECRET_KEY=sk_test_your_new_clerk_secret_key
    CLERK_WEBHOOK_SIGNING_SECRET=whsec_your_new_webhook_signing_secret

    # PostgreSQL Database Connection
    # Make sure your username, password, and database name are correct
    DATABASE_URL="postgresql://addy:lumosaddy@localhost:5432/fairshare"

    # Application Port
    PORT=3000

    # A custom secret password for your mail service (google)
    APP_PASSWORD=your_app_specific_password
    ```

#### Installation and Running

1.  Install the required dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:3000`.

---

### 2. Client Setup

Now, let's get the frontend client running.

#### Environment Variables

1.  In a new terminal, navigate to the client directory:
    ```bash
    cd /fair-share-client
    ```
2.  Create a new file named `.env` in the `fair-share-client` directory.
3.  Copy the following content into the file. The Vite publishable key is safe to expose on the client-side.

    ```env
    # Clerk Publishable Key (This is safe to expose in client-side code)
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_new_cler_publishable_key

    # The URL of your local backend server
    VITE_BASE_URL="http://localhost:3000"
    ```

#### Installation and Running

1.  Install the required dependencies:
    ```bash
    npm install
    ```
2.  Start the development client:
    ```bash
    npm run dev
    ```
    The client application should now be running, typically on a URL like `http://localhost:5173` (Vite's default) and will connect to your server at `http://localhost:3000`.

### 3. Running with Docker (Alternative Method)

If you have Docker installed, you can run the entire application with a single command.

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose must be installed on your machine.

#### Environment Variables

1.  Create a single `.env` file in the root directory of your project.
2.  Copy and paste the following content into it, combining the variables for both the server and client. Docker Compose will make these available to the correct services.

    ```env
    # server dev
    PORT=3000

    ## use `fs-db` as hostname and only change the variables inside angular braces
    DATABASE_URL=postgresql://postgres:<your_pass>@fs-db:5432/<your_db_name>
    CLERK_PUBLISHABLE_KEY=pk_test_your_new_clerk_publishable_key
    CLERK_SECRET_KEY=sk_test_your_new_clerk_secret_key
    CLERK_WEBHOOK_SIGNING_SECRET=whsec_your_clerk_signing_secret
    APP_PASSWORD=your_google_account_app_pass

    # client dev
    VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_new_vite_clerk_publishable_key
    CLERK_SECRET_KEY=sk_test_your_new_vite_clerk_secret_key
    VITE_BASE_URL="http://localhost:3000"
    ```

#### Build and Run

1.  Open your terminal in the project's root directory.
2.  Run the following command:
    ```bash
    docker compose up --build
    ```
3.  This command will:
    - Build the Docker images for the client and server based on their `Dockerfile`s.
    - Create and start the containers for all services defined in your `docker-compose.yml` file.
    - Show you the logs from all running services in your terminal.

Your application should now be accessible in your browser (typically at `http://localhost:5173` or whichever port you've configured for the client in your `docker-compose.yml`).

#### Stopping the Application

- To stop and remove the containers, networks, and volumes, press `Ctrl + C` in the terminal where the containers are running, and then run:
  ```bash
  docker compose down
  ```

## Challenges Faced

- Developing an efficient algorithm for calculating equal splits with unequal payments from multiple payers and optimizing the final debt settlement.
- Integrating a direct UPI payment option within the app to streamline debt settlement.
- Designing a user-friendly form for collecting expense data with a dynamic number of payers.
- Managing complex application state, including API data caching and synchronization, using Redux Toolkit & RTK Query.
- Implementing a feature to export payment history into a formatted PDF document.

## Future Scope

- **Real-time Notifications**: Add push notifications for expense updates, settlement requests, and confirmations.
- **Friends List**: Enable users to add other users as friends for easier group creation.
- **Role-Based Access**: Introduce roles within groups (e.g., Admin, Member) to manage permissions.
- **Group Chat**: Add a chat feature within each group to improve communication between members regarding expenses.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please fork the repository and create a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.
