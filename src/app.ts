import express, { Application, Request, Response } from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'
import { router } from "./routes"
import notFound from "./middlewares/notFound"
import { globalError } from "./middlewares/globalErrorHandeler"

const app:Application = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Wallet Backend API</title>
    <style>
        :root {
            --primary-color: #3b82f6;
            --background-color: #1a1a2e;
            --card-background: #232946;
            --text-color: #ffffff;
            --secondary-text-color: #b8c4d3;
            --border-color: #4b5d6f;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            line-height: 1.6;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
        }

        header {
            background-color: var(--card-background);
            padding: 2rem 0;
            text-align: center;
            border-bottom: 2px solid var(--primary-color);
        }

        header h1 {
            font-size: 2.5rem;
            margin: 0;
            color: var(--primary-color);
        }

        header p {
            font-size: 1.1rem;
            color: var(--secondary-text-color);
        }
        
        main {
            flex: 1;
            padding: 2rem 0;
        }

        section {
            background-color: var(--card-background);
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            border: 1px solid var(--border-color);
        }

        h2 {
            font-size: 2rem;
            margin-top: 0;
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
        }

        p, ul, table {
            color: var(--secondary-text-color);
        }

        ul {
            list-style-type: none;
            padding: 0;
        }

        ul li {
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
        }

        ul li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--primary-color);
            font-weight: bold;
        }

        code {
            background-color: rgba(60, 66, 88, 0.5);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: monospace;
            color: #d1d5db;
        }

        pre {
            background-color: #0d1117;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid var(--border-color);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        th, td {
            padding: 0.8rem;
            border-bottom: 1px solid var(--border-color);
        }

        th {
            background-color: #2e3556;
            color: var(--text-color);
        }

        a {
            color: var(--primary-color);
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .api-badge {
            background-color: var(--primary-color);
            color: var(--text-color);
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-right: 0.5rem;
            display: inline-block;
        }
        
        .get { background-color: #22c55e; }
        .post { background-color: #3b82f6; }
        .patch { background-color: #eab308; }
        .delete { background-color: #ef4444; }

        footer {
            text-align: center;
            padding: 2rem;
            color: var(--secondary-text-color);
        }
    </style>
</head>
<body>

    <header>
        <div class="container">
            <h1>Digital Wallet Backend API</h1>
            <p>A secure, modular, and role-based backend for a digital wallet system.</p>
        </div>
    </header>

    <main class="container">
        <section>
            <h2>Welcome to the API!</h2>
            <p>This is the backend service for a digital wallet application. It provides all the necessary functionalities for user management, wallet operations, and transaction tracking. You can interact with this API using an HTTP client like <a href="https://www.postman.com/" target="_blank">Postman</a> or simple command-line tools like curl.</p>
            <p>The base URL for all API endpoints is: <code>https://digital-waalleet.vercel.app/api/v1</code></p>
        </section>

        <section>
            <h2>Getting Started</h2>
            <p>To begin, you will need to register and then log in to get your authentication tokens.</p>
            <ol>
                <li><strong>Register:</strong> Send a <code>POST</code> request to <code>/api/v1/users/register</code> with your user data.</li>
                <li><strong>Login:</strong> Send a <code>POST</code> request to <code>/api/v1/auth/login</code> with your credentials. The response will include an accessToken and a refreshToken, which are stored as secure cookies.</li>
                <li><strong>Authenticate:</strong> For all protected routes, your HTTP client must be configured to send the authentication cookies with the request. The authCheck middleware will automatically handle this.</li>
            </ol>
        </section>
        
        <section>
            <h2>Core API Endpoints</h2>
            <p>Here is a list of the primary endpoints you can use to interact with the API.</p>
            
            <h3>Auth Endpoints</h3>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Description</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="api-badge post">POST</span></td>
                        <td><code>/auth/login</code></td>
                        <td>Authenticate and get JWT tokens.</td>
                        <td>Public</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge post">POST</span></td>
                        <td><code>/auth/refresh-token</code></td>
                        <td>Get a new access token using a refresh token.</td>
                        <td>Public</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge post">POST</span></td>
                        <td><code>/auth/reset-password</code></td>
                        <td>Change a user's password.</td>
                        <td>Any</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge post">POST</span></td>
                        <td><code>/auth/logout</code></td>
                        <td>Clear cookies and log out the user.</td>
                        <td>Any</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>User Endpoints</h3>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Description</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="api-badge post">POST</span></td>
                        <td><code>/users/register</code></td>
                        <td>Register a new user account.</td>
                        <td>Public</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge get">GET</span></td>
                        <td><code>/users</code></td>
                        <td>Get all users and agents.</td>
                        <td>Admin, Super-Admin</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge patch">PATCH</span></td>
                        <td><code>/users/agent-approve/:id</code></td>
                        <td>Approve a user to become an agent.</td>
                        <td>Admin, Super-Admin</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge delete">DELETE</span></td>
                        <td><code>/users/:id</code></td>
                        <td>Delete a user account.</td>
                        <td>Admin, Super-Admin</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Wallet Endpoints</h3>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Description</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="api-badge post">POST</span></td>
                        <td><code>/wallets/user-send-money</code></td>
                        <td>A user sends money to another user.</td>
                        <td>User</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge post">POST</span></td>
                        <td><code>/wallets/user-cash-out</code></td>
                        <td>A user withdraws money to an agent.</td>
                        <td>User</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge post">POST</span></td>
                        <td><code>/wallets/agent-cash-in</code></td>
                        <td>An agent adds money to a user's wallet.</td>
                        <td>Agent</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge get">GET</span></td>
                        <td><code>/wallets/all</code></td>
                        <td>Get all wallets in the system.</td>
                        <td>Admin, Super-Admin</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Transaction Endpoints</h3>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Endpoint</th>
                        <th>Description</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="api-badge get">GET</span></td>
                        <td><code>/transactions</code></td>
                        <td>Get transaction history for the logged-in user.</td>
                        <td>Any</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge get">GET</span></td>
                        <td><code>/transactions/all</code></td>
                        <td>Get all transactions in the system.</td>
                        <td>Admin, Super-Admin</td>
                    </tr>
                    <tr>
                        <td><span class="api-badge get">GET</span></td>
                        <td><code>/transactions/:id</code></td>
                        <td>Get transaction history for a specific user.</td>
                        <td>Admin, Super-Admin</td>
                    </tr>
                </tbody>
            </table>
        </section>

    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 Digital Wallet API. All rights reserved.</p>
            
            <div class="footer-links">
                <a href="mailto:rasel.sikder777.rk@gmail.com">Send Email</a><br/>
                <a href="https://www.linkedin.com/in/raseldev" target="_blank">Visit my LinkedIn</a>
            </div>
            <p>Visit the <a href="https://github.com/raselShikderDev/digital-wallet-ph" target="_blank">GitHub repository</a> for more details.</p>
        </div>
    </footer>

</body>
</html>`);
});


app.use(globalError)


app.use(notFound)

export default app