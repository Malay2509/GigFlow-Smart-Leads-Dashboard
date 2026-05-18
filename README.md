# Smart Leads Dashboard

A full-stack, production-ready B2B Lead Management CRM designed for high-performance and modern aesthetics. It provides a secure, role-based platform for Sales and Admin teams to capture, filter, track, and export leads in real-time. Built as a monorepo, the project features a robust Node/Express backend with MongoDB and a dynamic React/Vite frontend complete with dark mode, responsive layouts, and strict TypeScript compliance across the stack.

## Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, React Router |
| **Forms & State** | React Hook Form, Zod, Context API |
| **Backend** | Node.js, Express, TypeScript, Mongoose |
| **Database** | MongoDB |
| **Infrastructure** | Docker, Docker Compose, Nginx |

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd "GigFlow - Smart Leads Dashboard"
   ```

2. **Setup Environment Variables:**
   - Copy `server/.env.example` to `server/.env` and update `MONGO_URI` to your local or Atlas instance.
   - Copy `client/.env.example` (if present) or ensure `VITE_API_URL` points to the server.

3. **Start the Backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. **Start the Frontend:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## Docker Setup

To run the entire stack (Frontend, Backend, and MongoDB) effortlessly using Docker:

```bash
docker compose up --build
```
- The frontend will be available at `http://localhost:3000`
- The backend API will be running on `http://localhost:5000`
- MongoDB will run internally and persist data to a Docker volume.

## API Endpoints

| Method | Route | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive JWT |
| `GET` | `/api/leads` | Yes | Get paginated & filtered leads |
| `GET` | `/api/leads/:id` | Yes | Get a single lead by ID |
| `POST` | `/api/leads` | Yes | Create a new lead |
| `PUT` | `/api/leads/:id` | Yes | Update an existing lead |
| `DELETE` | `/api/leads/:id` | Yes (Admin) | Delete a lead |

## Role Permissions

| Feature | Admin | Sales |
| :--- | :---: | :---: |
| View Leads | ✅ | ✅ |
| Add Leads | ✅ | ✅ |
| Edit Leads | ✅ | ✅ |
| Export Leads to CSV | ✅ | ✅ |
| Delete Leads | ✅ | ❌ |

## Environment Variables

### Server (`server/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | API Server Port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb://mongo:27017/smart-leads` |
| `JWT_SECRET` | Secret key for JWT signing | `supersecretkey123` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

### Client (`client/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for API requests | `http://localhost:5000/api` |
