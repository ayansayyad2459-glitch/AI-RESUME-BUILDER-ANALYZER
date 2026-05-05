<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-brightgreen?style=for-the-badge" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge" alt="AI Powered" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge" alt="Status" />
</p>

# ✨ ResumeAI — AI Resume Analyzer & Builder

> A full-stack MERN application that uses AI to analyze resumes, provide smart job suggestions with direct links to LinkedIn, Indeed & more, and lets users build professional resumes with PDF export.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [AI Analysis Engine](#-ai-analysis-engine)
- [Screenshots](#-screenshots)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

### 🔐 Authentication
- JWT-based secure authentication
- User registration & login with validation
- Password hashing with bcryptjs (12 salt rounds)
- Protected routes on both frontend and backend

### 📄 AI Resume Analyzer
- **Drag & drop** PDF upload
- Extracts text from PDF resumes using `pdf-parse`
- AI-powered analysis across **10 career categories** with **200+ skills**
- Generates an **overall score** (0–100) based on weighted criteria
- Identifies **skills, experience level, education, strengths & weaknesses**
- Provides **actionable improvement suggestions**

### 💼 Smart Job Suggestions
- Matches resume skills to relevant job titles
- Generates direct search links to **8 platforms**:
  - LinkedIn, Indeed, Glassdoor, Naukri, Google Jobs, Monster, ZipRecruiter, AngelList
- Manual job search with title + location filters
- Platform-wise filtering for matched jobs

### 📝 Resume Builder
- Interactive form with dynamic sections (add/remove entries)
- Sections: Personal Info, Experience, Education, Skills, Projects, Certifications
- **3 professional templates** — Modern, Classic, Creative
- **Client-side PDF generation** with jsPDF (no server round-trip)
- Save resumes to database for future access

### 📊 Dashboard
- Overview stats (total resumes, analyzed count, average score)
- Quick action cards for Analyze, Build, and Browse Jobs
- Resume history with score badges and one-click access

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, React Router v6, Axios, React Toastify |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB, Mongoose, MongoDB Memory Server (dev) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **File Handling** | Multer (upload), pdf-parse (PDF text extraction) |
| **PDF Generation** | jsPDF (client-side) |
| **UI/Icons** | Lucide React, Inter Font (Google Fonts) |
| **Security** | Helmet.js, CORS, express-rate-limit, validator |
| **Styling** | Vanilla CSS — dark theme, glassmorphism, CSS animations |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (:5173)                        │
│  React + Vite                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Landing  │ │  Auth    │ │Dashboard │ │ Analyzer  │  │
│  │  Page    │ │Login/Reg │ │  Stats   │ │ Upload+AI │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐                              │
│  │ Builder  │ │  Jobs    │    Context API (Auth State)  │
│  │ PDF Gen  │ │ Search   │                              │
│  └──────────┘ └──────────┘                              │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (/api/*)
                       │ Vite Proxy
┌──────────────────────▼──────────────────────────────────┐
│                   SERVER (:5000)                         │
│  Express.js + Middleware                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │  Auth    │ │ Resume   │ │  Jobs    │                │
│  │ Routes   │ │ Routes   │ │ Routes   │                │
│  └────┬─────┘ └────┬─────┘ └──────────┘                │
│       │            │                                     │
│  ┌────▼─────┐ ┌────▼─────┐                              │
│  │   JWT    │ │    AI    │                              │
│  │Middleware│ │ Engine   │                              │
│  └──────────┘ └──────────┘                              │
└──────────────────────┬──────────────────────────────────┘
                       │ Mongoose
┌──────────────────────▼──────────────────────────────────┐
│                   MongoDB                                │
│          ┌──────────┐  ┌──────────┐                     │
│          │  Users   │  │ Resumes  │                     │
│          └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
AI RESUME ANALYZER/
│
├── server/                          # Backend API
│   ├── config/
│   │   └── db.js                    # MongoDB connection config
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                  # User schema & password methods
│   │   └── Resume.js                # Resume schema (analysis + builder)
│   ├── routes/
│   │   ├── auth.js                  # POST /register, /login, GET /profile
│   │   ├── resume.js                # POST /analyze, /create, GET /, /:id
│   │   └── jobs.js                  # GET /search?q=&location=
│   ├── utils/
│   │   └── analyzeResume.js         # 🧠 AI analysis engine
│   ├── server.js                    # Express app entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
├── client/                          # Frontend SPA
│   ├── public/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Responsive navigation bar
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Hero + features (public)
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Register.jsx         # Registration form
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── ResumeAnalyzer.jsx   # Upload + AI analysis results
│   │   │   ├── ResumeBuilder.jsx    # Interactive builder + PDF
│   │   │   └── JobSuggestions.jsx   # Job cards + search
│   │   ├── App.jsx                  # Routes & protected routes
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Complete design system
│   ├── index.html
│   ├── vite.config.js               # Vite + API proxy config
│   └── package.json
│
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **npm** v9+ (comes with Node.js)
- **MongoDB** (optional — the app uses in-memory MongoDB for development)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

### Running the Application

```bash
# Terminal 1 — Start Backend Server
cd server
node server.js
# ✅ Server running on port 5000
# ✅ In-memory MongoDB started automatically

# Terminal 2 — Start Frontend Dev Server
cd client
npm run dev
# ✅ App running on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔧 Environment Variables

Create a `.env` file in the `server/` directory:

```env
# MongoDB (leave as-is for in-memory dev DB, or use MongoDB Atlas URI)
MONGO_URI=mongodb://127.0.0.1:27017/resumeai

# JWT Secret (change this in production!)
JWT_SECRET=your_super_secret_key_here

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Server Port
PORT=5000
```

> **Note:** If no local MongoDB is running, the app automatically uses **MongoDB Memory Server** (in-memory database) — no setup needed for development.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT token | ❌ |
| `GET` | `/api/auth/profile` | Get user profile | ✅ |

### Resume

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/resume/analyze` | Upload PDF & get AI analysis | ✅ |
| `POST` | `/api/resume/create` | Save builder resume | ✅ |
| `GET` | `/api/resume/` | Get all user resumes | ✅ |
| `GET` | `/api/resume/:id` | Get single resume | ✅ |
| `DELETE` | `/api/resume/:id` | Delete resume | ✅ |

### Jobs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/jobs/search?q=&location=` | Search jobs across platforms | ✅ |

---

## 🧠 AI Analysis Engine

The custom-built AI engine analyzes resumes without any external API dependency:

```
Resume PDF
    │
    ▼
Text Extraction (pdf-parse)
    │
    ▼
┌──────────────────────────────┐
│     AI Analysis Pipeline     │
│                              │
│  1. Skill Extraction         │  → 200+ skills, 10 categories
│  2. Experience Detection     │  → Years + Level (Intern→Executive)
│  3. Education Parsing        │  → Degrees, institutions, fields
│  4. Strength Analysis        │  → Leadership, certifications, etc.
│  5. Weakness Detection       │  → Missing sections, improvements
│  6. Score Calculation        │  → Weighted 0–100 score
│  7. Job Matching             │  → Top categories → job titles
│  8. URL Generation           │  → Links to 8 job platforms
│                              │
└──────────────────────────────┘
    │
    ▼
Analysis Results + Job Suggestions
```

### Career Categories Covered
`Web Development` · `Backend Development` · `Mobile Development` · `Data Science` · `Machine Learning` · `DevOps` · `Database` · `Cybersecurity` · `UI/UX Design` · `Project Management`

### Scoring Breakdown

| Criteria | Max Points |
|----------|-----------|
| Technical Skills | 25 |
| Experience | 15 |
| Education | 10 |
| Strengths | 10 |
| Resume Length & Quality | 10 |
| Contact Info | 5 |
| Weakness Penalty | -15 |
| **Base Score** | **30** |

---

## 🔒 Security

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcryptjs — 12 salt rounds |
| Authentication | JWT tokens — 30 day expiry |
| HTTP Headers | Helmet.js — secure headers |
| Rate Limiting | 100 req / 15 min per IP |
| CORS | Restricted to frontend origin |
| Input Validation | `validator` library on server |
| File Validation | PDF only, 5MB max via Multer |
| XSS Protection | React's built-in escaping |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**

- GitHub: @ayansayyad2459-glitch
- LinkedIn: https://www.linkedin.com/in/ayan-ayan-sayyad-11090634b/

---

<p align="center">
  Made with ❤️ using the MERN Stack
</p>
