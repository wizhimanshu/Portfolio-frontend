# 🤖 Himanshu Kumar — Full Stack Portfolio

<div align="center">

![Portfolio Banner](https://img.shields.io/badge/Status-Live-22c55e?style=for-the-badge&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

**A dynamic, admin-managed full stack portfolio — built from scratch with a 3D interactive hero, K-means cluster analytics, and full CRUD capabilities.**

[🌐 Live Portfolio](https://portfolio-frontend-wpbg.onrender.com) • [⚙️ Backend API](https://portfolio-backend-rfcm.onrender.com/api)

</div>

---

## ✨ Highlights

- 🤖 **3D Interactive Hero** — Spline robot that tracks cursor movement in real-time
- 📊 **K-Means Cluster Analytics** — Unique visualization showing monthly activity by domain
- 🔐 **JWT Admin Dashboard** — Full CRUD for projects, skills, experience, achievements
- 🎯 **Fully Dynamic** — Every section updates live from the admin panel
- 📧 **Contact Form** — Emails delivered via Resend API
- ☁️ **Image Uploads** — Cloudinary integration for project and achievement images
- 🟢 **Always Online** — UptimeRobot keeps the backend warm 24/7

---

## 🏗️ Architecture

```
portfolio/
├── backend/                  # NestJS REST API
│   ├── src/
│   │   ├── auth/             # JWT authentication
│   │   ├── hero/             # Hero section CRUD
│   │   ├── projects/         # Projects CRUD + analytics
│   │   ├── categories/       # Domain/category management
│   │   ├── skills/           # Tech stack management
│   │   ├── experience/       # Experience timeline
│   │   ├── achievements/     # Achievements & certificates
│   │   ├── contact/          # Email via Resend
│   │   ├── upload/           # Cloudinary image uploads
│   │   └── prisma/           # Database service
│   └── prisma/
│       └── schema.prisma     # Database schema
│
└── frontend/                 # React + Vite
    └── src/
        ├── pages/            # Home, Projects, Analytics, Achievements
        ├── components/
        │   ├── home/         # Hero, FeaturedProjects, TechStack, Experience, Contact
        │   ├── layout/       # Navbar, Footer
        │   ├── admin/        # Dashboard, forms for all entities
        │   └── ui/           # SplineScene, Spotlight
        ├── api/              # Axios instances for all endpoints
        ├── store/            # Zustand (auth + theme)
        └── types/            # Shared TypeScript interfaces
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **NestJS** | REST API framework |
| **Prisma ORM v7** | Database ORM |
| **PostgreSQL (Neon)** | Serverless database |
| **JWT + Passport** | Authentication |
| **Cloudinary** | Image & file uploads |
| **Resend** | Transactional emails |
| **bcryptjs** | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + Vite 8** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **Zustand** | State management |
| **Recharts** | Analytics charts |
| **Framer Motion** | Animations |
| **Lucide React** | Icons |
| **@splinetool/react-spline** | 3D robot scene |

### Infrastructure
| Service | Purpose |
|---|---|
| **Render** | Backend + Frontend hosting (free tier) |
| **Neon** | Serverless PostgreSQL (free tier) |
| **Cloudinary** | Media storage (free tier) |
| **UptimeRobot** | Backend keep-alive pings |

---

## 📄 Database Schema

```prisma
Admin        → JWT-protected admin account
Hero         → Name, tagline, description, CV link
Project      → Title, description, image, GitHub, live URL, tags, date, domain
Category     → Domain/field grouping for projects
Skill        → Tech stack with icons, colors, usage count
Experience   → Professional timeline with role, company, dates
Achievement  → Hackathons, certificates, awards with drive links
```

---

## 🚀 Application Flow

```
Visitor lands on portfolio
        ↓
Hero Section loads (3D Spline robot + dynamic content from DB)
        ↓
Featured Projects → Tech Stack → Experience → Contact
        ↓
Visitor can browse Projects, Achievements, Analytics pages
        ↓
Admin navigates to /admin/login
        ↓
JWT token issued → Admin Dashboard unlocked
        ↓
Admin can CRUD: Projects, Skills, Categories, Experience, Achievements, Hero
        ↓
All changes reflect live on the portfolio instantly
```

---

## 📊 Analytics Page

The analytics page features a unique **K-Means inspired cluster visualization** that shows current month activity grouped by domain. Each dot represents a project or achievement — hover to see details.

Other analytics include:
- 📈 Domain distribution pie chart
- 📊 Tech stack usage horizontal bar chart
- 🏆 Latest Project, Achievement & Publication cards
- 📦 Total counts for projects, domains, skills, achievements

---

## 🔐 Admin Features

The `/admin` dashboard (JWT protected) allows full management of:

- **Hero Section** — Name, tagline, description, CV link
- **Projects** — Add/edit/delete with image upload, domain, tags, featured toggle
- **Domains** — Create project categories with custom ordering
- **Skills** — Tech stack with icons, colors, usage count, custom ordering
- **Experience** — Professional timeline entries
- **Achievements** — Certificates, hackathons, awards with drive links

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Backend API | Render (Web Service) | `https://your-backend.onrender.com` |
| Frontend | Render (Static Site) | `https://your-frontend.onrender.com` |
| Database | Neon (Serverless Postgres) | Neon Dashboard |
| Images | Cloudinary | Cloudinary Dashboard |

---

### Other Resources
- [Spline](https://spline.design) — 3D design tool for web
- [Neon](https://neon.tech) — Serverless Postgres
- [Render](https://render.com) — Cloud hosting
- [Cloudinary](https://cloudinary.com) — Media management
- [Resend](https://resend.com) — Email API
- [UptimeRobot](https://uptimerobot.com) — Uptime monitoring
- [Devicons](https://devicon.dev) — Tech stack icons
- [21st.dev](https://21st.dev) - The stunning **3D interactive robot**

---

<div align="center">

**Built by Himanshu Kumar**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/connectwith-himanshu-kumar)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/wizhimanshu)

</div>
