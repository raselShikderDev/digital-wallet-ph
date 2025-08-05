# Digital Wallet Backend API

### Secure, Modular, and Role-Based Digital Wallet System

This project is a robust and secure backend API for a digital wallet system, built with Node.js, Express, and Mongoose. It implements core financial operations for users and agents, all secured by JWT-based authentication and a role-based authorization system.

The application is designed with a modular architecture for clarity, scalability, and maintainability, and is configured for seamless deployment on platforms like Vercel.

### Table of Contents

1.  [Features](https://www.google.com/search?q=%23features)
2.  [Technologies](https://www.google.com/search?q=%23technologies)
3.  [Folder Structure](https://www.google.com/search?q=%23folder-structure)
4.  [Getting Started](https://www.google.com/search?q=%23getting-started)
5.  [API Endpoints](https://www.google.com/search?q=%23api-endpoints)
6.  [Vercel Deployment](https://www.google.com/search?q=%23vercel-deployment)
7.  [License](https://www.google.com/search?q=%23license)

### Features

The API provides the following functionalities, organized by user role:

**🔑 Authentication & Security**

  * **JWT-based login** with `access` and `refresh` tokens stored in secure cookies.
  * **Secure password hashing** using `bcrypt`.
  * **Role-based route protection** for `admin`, `user`, and `agent` roles.

**👥 User Management**

  * **User Registration:** New users are registered with an automatically created wallet and an initial balance of ৳50.
  * **Admin Controls:** Admins can view all users and agents, approve/suspend agents, and block/unblock user wallets.
  * **Agent Approval:** Agents must be approved by an admin to perform cash-out or cash-in transactions.

**🏦 Wallet & Transaction Management**

  * **User Operations:**
      * Send money to another user.
      * Cash out to withdraw money to a verified agent.
      * Allowed top up their account via CashIn by agent.
      * View their transaction history.
  * **Agent Operations:**
      * Allowed to add money to a user's wallet by Cash Out method.
      * Deposit money to user by using CashIn.
  * **Atomic Transactions:** All financial operations are handled atomically using Mongoose transactions to ensure data integrity.
  * **Transaction History:** All transactions are stored and trackable.

### Technologies

  * **Platform:** Node.js, Vercel
  * **Framework:** Express.js
  * **Database:** MongoDB
  * **ODM:** Mongoose
  * **Authentication:** JSON Web Tokens (JWT), `cookie-parser`
  * **Validation:** Zod
  * **Security:** `bcrypt` for password hashing
  * **Language:** TypeScript
  * **Other:** `http-status-codes`, `cors`

### Folder Structure

```
digital-wallet/
├── node_modules/           # Automatically generated directory for dependencies.
├── src/
│   ├── config/             # Environment variables and configuration settings.
│   │   └── env.ts
│   ├── errorHelper/        # Custom error handling and utility classes.
│   ├── interfaces/         # Global interfaces and types.
│   ├── middlewares/        # Custom Express middleware (e.g., authCheck, error handlers).
│   │   ├── authCheck.ts
│   │   ├── globalErrorHandeler.ts
│   │   ├── notFound.ts
│   │   └── requestValidator.ts
│   ├── modules/            # The core business logic, organized by feature.
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   └── auth.service.ts
│   │   ├── transaction/
│   │   │   ├── transaction.controller.ts
│   │   │   ├── transaction.interface.ts
│   │   │   ├── transaction.model.ts
│   │   │   ├── transaction.route.ts
│   │   │   └── transaction.services.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.interfaces.ts
│   │   │   ├── user.model.ts
│   │   │   ├── user.route.ts
│   │   │   └── user.services.ts
│   │   └── wallet/
│   │       ├── wallet.controller.ts
│   │       ├── wallet.interface.ts
│   │       ├── wallet.model.ts
│   │       ├── wallet.route.ts
│   │       └── wallet.services.ts
│   ├── routes/             # Central routing file that combines all module routes.
│   │   └── index.ts
│   ├── utils/              # Helper functions (e.g., async handler, token creation, etc.).
│   │   ├── asyncHandeler.ts
│   │   ├── createuserToken.ts
│   │   ├── jwt.ts
│   │   ├── sendResponse.ts
│   │   └── setCookies.ts
│   ├── app.ts              # Express application setup, middleware, and route configuration.
│   └── server.ts           # Server entry point, MongoDB connection, and super admin seeding.
├── api/                    # Vercel-specific serverless function entry point.
│   └── index.ts
├── .env                    # Environment variables (local).
├── .env.examples           # Example environment variables file.
├── .gitignore              # Files and directories to be ignored by Git.
├── eslint.config.mts       # ESLint configuration.
├── package-lock.json       # Dependency tree lock file.
├── package.json            # Project metadata and scripts.
├── tsconfig.json           # TypeScript compiler configuration.
└── README.md
```

### Getting Started

To get a local copy up and running, follow these simple steps.

**Prerequisites:**

  * Node.js (v18+)
  * MongoDB (or a connection string to a cloud database like MongoDB Atlas)

**Installation:**

1.  Clone the repository:
    ```bash
    git clone <your-repo-link>
    cd digital-wallet
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory and add your environment variables using the `.env.examples` as a guide.
    ```env
    # .env
    MONGO_URI=<your_mongodb_connection_string>
    PORT=5000
    BCRYPT_SALT_ROUND=10
    JWT_SECRET=your_jwt_secret_key
    JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
    SUPER_ADMIN_PASSWORD=your_super_admin_password
    SUPER_ADMIN_EMAIL=your_super_admin_email
    ```
4.  Run the application in development mode:
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:5000`. It will also connect to MongoDB and seed a super admin account if one does not already exist.

### API Endpoints

All endpoints are prefixed with `/api/v1`.

#### `Auth`

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| `POST` | `/auth/login` | Authenticate and get JWT tokens. | Public |
| `POST` | `/auth/refresh-token`| Get a new access token using a refresh token. | Public |
| `POST` | `/auth/reset-password`| Change a user's password. | Any |
| `POST` | `/auth/logout` | Clear cookies and log out the user. | Any |

#### `User`

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| `POST` | `/users/register` | Register a new user account. | Public |
| `GET` | `/users` | Get all users and agents. | `Admin`, `Super-Admin` |
| `GET` | `/users/all-users` | Get all users (non-agents). | `Admin`, `Super-Admin` |
| `GET` | `/users/all-agents` | Get all approved agents. | `Admin`, `Super-Admin` |
| `GET` | `/users/agents/:id`| Get a single agent by ID. | `Admin`, `Super-Admin` |
| `PATCH`| `/users/agent-approve/:id`| Approve a user to become an agent. | `Admin`, `Super-Admin` |
| `PATCH`| `/users/agent-status/:id` | Toggle an agent's approved/suspended status. | `Admin`, `Super-Admin` |

#### `Wallet`

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| `POST` | `/wallets/user-send-money`| A user sends money to another user. | `User` |
| `POST` | `/wallets/user-cash-out` | A user withdraws money (cash-out) to an agent. | `User` |
| `POST` | `/wallets/agent-cash-in` | An agent adds money (cash-in) to a user's wallet. | `Agent` |
| `GET` | `/wallets/all` | Get all wallets in the system. | `Admin`, `Super-Admin` |
| `GET` | `/wallets/:id` | Get a single wallet by ID. | `Admin`, `Super-Admin` |
| `PATCH`| `/wallets/status/:id`| Toggle a wallet's status (active/blocked). | `Admin`, `Super-Admin` |

#### `Transaction`

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| `GET` | `/transactions` | Get transaction history for the logged-in user. | Any |
| `GET` | `/transactions/all` | Get all transactions in the system. | `Admin`, `Super-Admin` |
| `GET` | `/transactions/:id` | Get transaction history for a specific user. | `Admin`, `Super-Admin` |

### Vercel Deployment

This project includes a serverless function entry point for easy deployment to Vercel.

  * The `api/index.ts` file acts as the serverless function handler.
  * Your `app.ts` is configured to handle the Express application, which is then served by the Vercel handler.

To deploy, simply push your code to a Git repository and link it to a new project in your Vercel dashboard.

