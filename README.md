# Findora Frontend

Findora is a modern, cloud-based Lost & Found platform. This repository contains the React + TypeScript + Vite frontend client styled with Ant Design (antd).

## Technology Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript (strict type checking)
- **UI Toolkit**: Ant Design (antd)
- **Routing**: React Router DOM (v6)
- **API Client**: Axios
- **Form Management**: React Hook Form
- **Schema Validation**: Zod
- **Icons**: Lucide React

## Backend Microservices Architecture
The frontend is built to communicate with a Spring Boot microservices backend routed through a central API Gateway.

```
                  ┌──────────────┐
                  │   Frontend   │
                  └──────┬───────┘
                         │
                         ▼ (Axios API Client)
                  ┌──────────────┐
                  │ API Gateway  │ (http://localhost:8080)
                  └──────┬───────┘
                         │ (Routing)
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │User Service│  │Item Service│  │Media Serv. │
  │ (Port 8081)│  │ (Port 8082)│  │ (Port 8083)│
  └────────────┘  └────────────┘  └────────────┘
```

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Installation
Install the project dependencies defined in `package.json`:
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```env
API_BASE_URL=http://localhost:8080
USE_MOCK_API=true
```
- `API_BASE_URL`: Base gateway address where calls are sent.
- `USE_MOCK_API`: Set to `true` to use the interactive simulated backend (runs completely in memory using `localStorage` for testing CRUD actions, image uploads, profile modifications, etc. without the backend microservices active).

### 4. Running the Development Server
Launch the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Production Build
Compile the application and build optimized production assets:
```bash
npm run build
```
This compiles the TypeScript code and bundles static files into the `dist/` directory.

### 6. Linting
Verify code styling and catch issues:
```bash
npm run lint
```
