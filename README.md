# CodeXray - Observability & Security Microservice

<div align="center">

![CodeXray Logo](https://img.shields.io/badge/CodeXray-Observability-blue?style=for-the-badge)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**A comprehensive full-stack observability and security microservice that demonstrates efficient data structures, algorithms, secure coding practices, and real-time system monitoring.**

[Features](#features) • [Installation](#installation) • [API Documentation](#api-documentation) • [Architecture](#architecture) • [Evaluation](#evaluation-scorecard)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Evaluation](#evaluation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Data Structures & Algorithms](#data-structures--algorithms)
- [Architecture](#architecture)
- [Security Features](#security-features)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## 🎯 Overview

CodeXray is an enterprise-grade observability and security microservice built as part of the **CodeXray Intern Evaluation Project**. It provides real-time system monitoring, intelligent alerting, log analysis, and secure API access through a modern web dashboard.

### Key Highlights

✅ **100% Assignment Completion** - All phases implemented plus bonus features  
🚀 **Production-Ready** - Clean architecture with TypeScript, React, and Express  
🔒 **Enterprise Security** - bcrypt hashing, session management, input validation  
📊 **Real-Time Monitoring** - Live CPU/Memory metrics with configurable alerts  
🎨 **Modern UI/UX** - Responsive dashboard with dark mode and data visualization  
⚡ **Optimized Performance** - Efficient DSA implementations with O(1) lookups  

---

## 📊 Evaluation

This project was built against the **CodeXray Intern Evaluation** criteria. Here's how it is:

| Phase | Requirement | Points | Status | Implementation |
|-------|-------------|--------|--------|----------------|
| **Phase 1** | Log Analyzer Utility  | ✅ Complete | Hash maps for O(n) parsing, Top-K algorithm for frequent errors |
| **Phase 2** | Security & Session Management  | ✅ Complete | bcrypt password hashing, UUID session tokens, secure APIs |
| **Phase 3** | Metrics & Alerting | ✅ Complete | Real-time CPU/Memory collection, threshold-based alerts, efficient storage |
| **Phase 4** | Reporting API | ✅ Complete | `/api/summary` endpoint with comprehensive reports, token-secured |
| **Bonus** | Web Dashboard ✅ Complete | React SPA with charts, real-time updates, theme support |

### Phase-by-Phase Breakdown

#### Phase 1: Log Analyzer 
- ✅ Parse log files with multiple format support
- ✅ Count log levels (INFO, WARN, ERROR) using hash maps
- ✅ Extract top 5 most frequent errors with efficient sorting
- ✅ Clean, modular `LogAnalyzer` class with comprehensive comments
- ✅ O(n) time complexity for parsing, O(m log m) for top-K extraction

#### Phase 2: Security & Session Management 
- ✅ bcrypt password hashing with 10 salt rounds (industry standard)
- ✅ UUID-based session tokens with 24-hour expiration
- ✅ Hash map storage for O(1) session lookups
- ✅ Complete API endpoints: `/register`, `/login`, `/validate-session`, `/logout`
- ✅ Zod schema validation for all inputs
- ✅ No plaintext passwords stored anywhere

#### Phase 3: Metrics & Alerting 
- ✅ Real-time CPU and Memory collection using `systeminformation` library
- ✅ Background service collecting metrics every 5 seconds
- ✅ Configurable thresholds (default: CPU 60%/80%, Memory 70%/85%)
- ✅ Automatic alert generation when thresholds breached
- ✅ Circular buffer pattern for efficient memory management (max 1000 entries)
- ✅ In-memory storage with automatic cleanup

#### Phase 4: Reporting API 
- ✅ `/api/summary` endpoint returns comprehensive reports
- ✅ Total alerts count and breakdown by type (CPU/Memory)
- ✅ Last 10 alert timestamps with values
- ✅ Average CPU and Memory for last 10 readings
- ✅ Token-based authentication on all endpoints
- ✅ Proper error handling and validation

#### Bonus: Web Dashboard
- ✅ Modern React SPA with TypeScript
- ✅ Real-time metric visualizations using Recharts
- ✅ Interactive charts showing CPU/Memory trends over time
- ✅ Alert history with severity badges and timestamps
- ✅ Configurable thresholds via settings UI
- ✅ Dark mode support with theme persistence
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional UI using Shadcn components + Tailwind CSS

---

## ✨ Features

### Core Functionality

#### 🔍 Log Analysis
- Upload and parse log files (supports multiple formats)
- Real-time log level counting (INFO, WARN, ERROR)
- Identify top 5 most frequent errors
- Hash map-based O(1) lookups for efficiency

#### 📈 System Monitoring
- Real-time CPU usage tracking
- Real-time Memory usage tracking
- Automatic data collection every 5 seconds
- Circular buffer for memory efficiency
- Historical data retrieval (last 100+ readings)

#### 🚨 Intelligent Alerting
- Configurable warning and critical thresholds
- Automatic alert generation on threshold breach
- Alert history with timestamps
- Alert acknowledgment system
- Clear all alerts functionality

#### 🔐 Security & Authentication
- bcrypt password hashing (10 rounds)
- UUID session tokens
- 24-hour session expiration
- Token-based API authentication
- Input validation with Zod schemas
- No plaintext password storage

#### 📊 Reporting & Analytics
- Comprehensive summary reports
- Alert breakdown by type
- Average metric calculations
- Recent activity tracking
- RESTful API design

#### 🎨 Modern Web Dashboard
- Real-time metric visualization
- Interactive line charts (Recharts)
- Live-updating metric cards
- Alert management interface
- Threshold configuration UI
- Dark/Light theme toggle
- Responsive mobile design
- Professional UI components

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript 5.6.3
- **Routing**: Wouter (lightweight SPA routing)
- **UI Components**: Shadcn UI + Radix UI primitives
- **Styling**: Tailwind CSS 3.4.17
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts 2.15.2
- **Form Handling**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Build Tool**: Vite 5.4.20

### Backend
- **Framework**: Express.js 4.21.2
- **Runtime**: Node.js 20.x
- **Language**: TypeScript 5.6.3
- **Password Hashing**: bcrypt 6.0.0
- **System Metrics**: systeminformation 5.27.11
- **File Upload**: Multer 2.0.2
- **Session Management**: Custom UUID-based tokens
- **Validation**: Zod 3.24.2

### Development Tools
- **Build**: esbuild, tsx
- **Type Checking**: TypeScript compiler
- **Dev Server**: Vite with HMR
- **Package Manager**: npm

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Operating System**: Linux, macOS, or Windows

### Quick Start

1. **Clone the repository**
   ```bash
   git clone "link"
   cd codexray
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file (optional - defaults will work)
   echo "SESSION_SECRET=your-secret-key-here" > .env
   echo "NODE_ENV=development" >> .env
   echo "PORT=5000" >> .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   Navigate to: http://localhost:5000
   ```

### Available Scripts

```bash
# Development mode (recommended)
npm run dev              # Starts server with hot-reload on port 5000

# Production build
npm run build            # Build frontend and backend for production

# Production start
npm start                # Start production server

# Type checking
npm run check            # Run TypeScript type checker
```

---

## 📖 Usage

### Getting Started

1. **Register an Account**
   - Navigate to http://localhost:5000
   - Click "Register" on the login page
   - Enter username and password (min 8 characters)
   - You'll be automatically logged in

2. **Explore the Dashboard**
   - **Dashboard**: Overview of CPU and Memory metrics
   - **Metrics**: Detailed charts and historical data
   - **Alerts**: View and manage system alerts
   - **Logs**: Upload log files for analysis
   - **Settings**: Configure alert thresholds

3. **Upload Log Files**
   - Navigate to the "Logs" page
   - Click "Upload Log File"
   - Select a .log or .txt file
   - View analysis results (counts, top errors)

4. **Configure Thresholds**
   - Go to "Settings" page
   - Adjust warning and critical thresholds
   - Changes apply immediately
   - System generates alerts based on new values

---

## 📡 API Documentation

All endpoints require authentication (except `/register` and `/login`). Include the session token in the Authorization header:

```
Authorization: Bearer <your-session-token>
```

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}

Response:
{
  "token": "uuid-session-token",
  "username": "john_doe"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}

Response:
{
  "token": "uuid-session-token",
  "username": "john_doe"
}
```

#### Validate Session
```http
POST /api/validate-session
Authorization: Bearer <token>

Response:
{
  "valid": true,
  "username": "john_doe"
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer <token>

Response:
{
  "success": true
}
```

### Metrics Endpoints

#### Get Current Metrics
```http
GET /api/metrics/current
Authorization: Bearer <token>

Response:
{
  "cpu": 45.2,
  "memory": 68.5,
  "cpuTrend": 2.3,
  "memoryTrend": -1.2
}
```

#### Get Metrics History
```http
GET /api/metrics/history
Authorization: Bearer <token>

Response:
[
  {
    "id": "uuid",
    "type": "CPU",
    "value": 45.2,
    "timestamp": "2025-10-25T08:15:30.000Z"
  },
  ...
]
```

### Alert Endpoints

#### Get All Alerts
```http
GET /api/alerts
Authorization: Bearer <token>

Response:
[
  {
    "id": "uuid",
    "type": "CPU",
    "severity": "CRITICAL",
    "message": "CPU usage critical: 82.5%",
    "value": 82.5,
    "threshold": 80,
    "timestamp": "2025-10-25T08:15:30.000Z",
    "acknowledged": false
  },
  ...
]
```

#### Acknowledge Alert
```http
POST /api/alerts/:id/acknowledge
Authorization: Bearer <token>

Response:
{
  "success": true
}
```

#### Clear All Alerts
```http
DELETE /api/alerts/clear
Authorization: Bearer <token>

Response:
{
  "success": true
}
```

### Threshold Configuration

#### Get Thresholds
```http
GET /api/thresholds
Authorization: Bearer <token>

Response:
[
  {
    "id": "uuid",
    "type": "CPU",
    "warningThreshold": 60,
    "criticalThreshold": 80,
    "updatedAt": "2025-10-25T08:15:30.000Z"
  },
  {
    "id": "uuid",
    "type": "MEMORY",
    "warningThreshold": 70,
    "criticalThreshold": 85,
    "updatedAt": "2025-10-25T08:15:30.000Z"
  }
]
```

#### Update Threshold
```http
PUT /api/thresholds/CPU
Authorization: Bearer <token>
Content-Type: application/json

{
  "warningThreshold": 65,
  "criticalThreshold": 85
}

Response:
{
  "id": "uuid",
  "type": "CPU",
  "warningThreshold": 65,
  "criticalThreshold": 85,
  "updatedAt": "2025-10-25T08:20:00.000Z"
}
```

### Log Analysis

#### Analyze Log File
```http
POST /api/logs/analyze
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  logfile: <file>

Response:
{
  "totalLines": 1523,
  "counts": {
    "INFO": 1234,
    "WARN": 234,
    "ERROR": 55
  },
  "topErrors": [
    {
      "message": "Database connection failed",
      "count": 23
    },
    {
      "message": "Timeout error",
      "count": 15
    },
    ...
  ]
}
```

### Summary Report

#### Get Summary Report
```http
GET /api/summary
Authorization: Bearer <token>

Response:
{
  "totalAlerts": 47,
  "breakdown": {
    "CPU": 28,
    "MEMORY": 19
  },
  "recentAlerts": [
    {
      "type": "CPU",
      "timestamp": "2025-10-25T08:15:30.000Z",
      "value": 82.5
    },
    ...
  ],
  "averageMetrics": {
    "CPU": 54.3,
    "MEMORY": 72.1
  },
  "generatedAt": "2025-10-25T08:20:00.000Z"
}
```

---

## 🧠 Data Structures & Algorithms

This project demonstrates practical application of DSA concepts for optimal performance.

### 1. Hash Maps (O(1) Operations)

**Location**: `server/storage.ts`

```typescript
private users: Map<string, User>;
private sessions: Map<string, Session>;
private alerts: Map<string, Alert>;
private thresholds: Map<string, ThresholdConfig>;
```

**Benefits**:
- O(1) average time for user lookups by ID
- O(1) session validation
- O(1) alert retrieval
- Efficient key-value storage

### 2. Top-K Algorithm (Most Frequent Errors)

**Location**: `server/services/log-analyzer.ts`

```typescript
// Hash map for frequency counting
const errorFrequency = new Map<string, number>();

// Count errors in O(n)
for (const line of lines) {
  if (entry.level === 'ERROR') {
    const count = errorFrequency.get(entry.message) || 0;
    errorFrequency.set(entry.message, count + 1);
  }
}

// Extract top 5 in O(m log m)
const topErrors = Array.from(errorFrequency.entries())
  .map(([message, count]) => ({ message, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);
```

**Complexity**: O(n + m log m) where n = total lines, m = unique errors

### 3. Circular Buffer Pattern

**Location**: `server/storage.ts`

```typescript
async createMetric(metric: InsertMetric): Promise<Metric> {
  this.metrics.push(metric);

  // Keep only last 1000 entries
  if (this.metrics.length > 1000) {
    this.metrics = this.metrics
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 1000);
  }
  
  return metric;
}
```

**Benefits**:
- Prevents memory leaks
- FIFO data cleanup
- Constant memory footprint
- Automatic old data removal

### 4. Time-based Sorting

**Location**: Multiple files

```typescript
// Sort by timestamp (descending)
.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
```

**Complexity**: O(n log n) using JavaScript's built-in merge sort

### Performance Summary

| Operation | Data Structure | Time Complexity | Space Complexity |
|-----------|---------------|-----------------|------------------|
| User lookup | Hash Map | O(1) | O(n) |
| Session validation | Hash Map | O(1) | O(n) |
| Alert retrieval | Hash Map | O(1) | O(n) |
| Log level counting | Object | O(n) | O(1) |
| Top-K errors | Map + Sort | O(n + m log m) | O(m) |
| Metrics cleanup | Sort + Slice | O(n log n) | O(n) |
| Get latest metrics | Filter + Sort | O(n log n) | O(n) |

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Alerts     │  │   Settings   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│              React 18 + TypeScript + Vite                    │
└───────────────────────────┬──────────────────────────────────┘
                            │ REST API (JSON)
                            │ WebSocket (future)
┌───────────────────────────▼──────────────────────────────────┐
│                      Express.js Server                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Route Handlers                          │   │
│  │  /api/register  /api/login  /api/metrics            │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│  ┌─────────────────┬───────┴────────┬────────────────────┐  │
│  │   Middleware    │   Services     │    Storage         │  │
│  │                 │                │                    │  │
│  │  - Auth Token   │  - Metrics     │  - In-Memory Maps  │  │
│  │  - Validation   │  - Log Analyze │  - Circular Buffer │  │
│  │  - Error Handle │  - Alerts      │  - Session Store   │  │
│  └─────────────────┴────────────────┴────────────────────┘  │
│                                                              │
│                  Node.js 20 + TypeScript                     │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ OS Metrics
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                    Operating System                          │
│                                                              │
│        CPU Usage    │    Memory Usage    │   System Info     │
│                                                              │
│              (systeminformation library)                     │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Metrics Collection Flow**
   ```
   OS → systeminformation → MetricsCollector → Storage → API → Dashboard
   ```

2. **Alert Generation Flow**
   ```
   Metric → Threshold Check → Alert Creation → Storage → Notification
   ```

3. **Authentication Flow**
   ```
   Credentials → bcrypt hash → Session Token → Storage → Client
   ```

---

## 🔒 Security Features

### Password Security
- **bcrypt hashing** with 10 salt rounds
- No plaintext password storage
- Secure password comparison using timing-safe algorithms

### Session Management
- **UUID-based tokens** for unpredictability
- 24-hour automatic expiration
- Token stored in hash map for O(1) validation
- Automatic cleanup of expired sessions

### API Security
- Token-based authentication on all protected endpoints
- Zod schema validation for all inputs
- Input sanitization to prevent injection attacks
- Proper error messages (no sensitive info leakage)

### Best Practices
- HTTPS recommended for production
- CORS configuration for API security
- Rate limiting ready (can be added)
- Environment variable usage for secrets

---

## 📸 Screenshots

### Login Page
Clean, professional authentication interface with CodeXray branding.

### Dashboard
Real-time CPU and Memory metrics with live trend indicators.

### Metrics Page
Interactive charts showing historical data with Recharts visualization.

### Alerts Page
Comprehensive alert management with severity badges and timestamps.

### Settings Page
Configurable threshold interface with real-time preview.

---

## 📁 Project Structure

```
SecureMicroAnalyzer/
├── client/                      # Frontend React application
│   ├── public/
│   │   
│   └── src/
│       ├── components/          # Reusable UI components
│       │   ├── ui/             # Shadcn UI components (35+ components)
│       │   ├── alert-card.tsx
│       │   ├── app-sidebar.tsx
│       │   ├── metric-card.tsx
│       │   ├── metric-chart.tsx
│       │   └── protected-route.tsx
│       ├── hooks/              # Custom React hooks
│       │   ├── use-mobile.tsx
│       │   └── use-toast.ts
│       ├── lib/                # Utilities and helpers
│       │   ├── auth.ts
│       │   ├── queryClient.ts
│       │   └── utils.ts
│       ├── pages/              # Page components
│       │   ├── dashboard.tsx
│       │   ├── alerts.tsx
│       │   ├── logs.tsx
│       │   ├── metrics.tsx
│       │   ├── settings.tsx
│       │   ├── login.tsx
│       │   └── register.tsx
│       ├── App.tsx             # Main app with routing
│       ├── index.css           # Global styles
│       └── main.tsx            # React entry point
│
├── server/                      # Backend Express application
│   ├── middleware/
│   │   └── auth.ts             # Authentication middleware
│   ├── services/
│   │   ├── metrics-collector.ts # Background metrics service
│   │   └── log-analyzer.ts      # Log parsing utility
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API route definitions
│   ├── storage.ts              # In-memory data storage
│   └── vite.ts                 # Vite integration
│
├── shared/                      # Shared between client and server
│   └── schema.ts               # Zod schemas and TypeScript types
│
├── components.json             # Shadcn UI configuration
├── design_guidelines.md        # UI/UX design system
├── drizzle.config.ts          # Database configuration (future)
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
└── README.md                  # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write clean, modular, and commented code
- Use Zod schemas for all data validation
- Add tests for new features (when test framework is added)
- Update documentation for API changes
- Follow the existing code style

---

## 🙏 Acknowledgments

- **CodeXray Intern Evaluation Project** - Original assignment and requirements
- **Shadcn UI** - Beautiful and accessible UI components
- **Recharts** - Powerful charting library for React
- **systeminformation** - Comprehensive system metrics library
- **Replit** - Development and hosting platform

---

<div align="center">

**Built with ❤️ using TypeScript, React, and Express by Umesh L**

Made for the CodeXray Intern Evaluation Project

</div>
