# **Pulse**
### *A Real-Time Polling & Decision-Making App*

Pulse helps groups make fast, organized decisions without messy chat threads.  
Create polls instantly, share links, and collect structured feedback in real time.

---

## 🚀 **Hosted URLs**
| Service | URL |
|--------|-----|
| **Frontend (Vercel)** | https://pulse-front-end-sigma.vercel.app |
| **Backend (Render)** | https://pulsebackend-mn4p.onrender.com |
| **Frontend GitHub Repo** | https://github.com/Crunchymon/PulseFrontEnd |

---

## 🧩 **Problem Statement**

Coordinating group decisions — such as picking a meeting time or deciding where to eat — often becomes chaotic in chat apps. Information gets buried, votes get missed, and decisions take longer than necessary.

**Pulse solves this problem** by offering a simple, centralized, and shareable platform where users can create polls and collect responses instantly.

---

## 🏛️ **System Architecture**

Pulse follows a fully decoupled architecture:


### **Tech Breakdown**
- **Frontend:** Next.js (React), TypeScript, TailwindCSS, Shadcn/UI  
- **Backend:** Node.js, Express.js, TypeScript, Prisma, Zod  
- **Database:** MySQL  
- **Authentication:** JWT + bcrypt  
- **Hosting:**  
  - Frontend → Vercel  
  - Backend → Render  
  - Database → PlanetScale / Railway  

---

## ✨ **Key Features**

### 🔐 **Authentication & Authorization**
- Email/password signup & login using custom **JWT-based auth**
- Users can **only delete their own polls**
- Secure password hashing using **bcrypt**

---

### 🗳️ **Poll Management (CRUD)**
- **Create**, **read**, and **delete** polls (only by the owner)
- Users can:
  - **Vote** on any poll  
  - **Retract** their vote  
- Full validation on poll creation & voting (Zod)

---

### 🔍 **Dashboard: Search, Filter, Sort & Pagination**
Accessible via `/dashboard`.

| Feature | Description |
|--------|-------------|
| **Search** | Search polls by question text |
| **Filter** | Search input acts as the main filter |
| **Sort** | Sort by creation date (Newest → Oldest or reverse) |
| **Pagination** | 10 polls per page with navigation controls |

Supports:
- **My Polls**
- **Polls I Voted On**

---

### 🔄 **Real-Time Experience (Short Polling)**
- The poll details page auto-refreshes every few seconds
- Provides a near real-time view of vote count updates

---

### 🧭 **Frontend Routing**
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/login` | Login |
| `/signup` | Signup |
| `/dashboard` | Manage polls |
| `/create` | Create a new poll |
| `/profile` | User profile |
| `/polls/:id` | Poll details page |

---

### 🧩 **Stretch Goal: Google Social Login**
- Add OAuth2-based “Sign in with Google” for one-click onboarding.

---

## 🧰 **Tech Stack Overview**

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js, React, TypeScript, Axios, TailwindCSS, Shadcn/UI |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, Zod |
| **Database** | MySQL |
| **Auth** | JWT, bcrypt |
| **Hosting** | Vercel (FE), Render (BE), PlanetScale/Railway (DB) |

---

## 📡 **API Overview**

### **Auth Endpoints**
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Login & receive JWT | Public |

---

### **User Endpoints**
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/users/me` | GET | Get current user profile | Authenticated |

---

### **Poll Endpoints**
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/polls` | POST | Create a new poll | Authenticated |
| `/api/polls` | GET | Get user-created polls (with search, sort, pagination) | Authenticated |
| `/api/polls/:id` | GET | Get poll details | Public |
| `/api/polls/:id` | DELETE | Delete your own poll | Authenticated (Owner Only) |

---

### **Voting Endpoints**
| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/votes` | POST | Cast a vote | Authenticated |
| `/api/votes/:pollId` | DELETE | Retract a vote | Authenticated |

---

## 🎯 **Conclusion**

Pulse delivers a clean, fast, and efficient way for groups to make decisions with real-time feedback.  
Its decoupled architecture makes it scalable, maintainable, and ideal for modern applications.

---

