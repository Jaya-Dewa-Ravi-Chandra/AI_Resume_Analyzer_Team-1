AI-Powered Resume Analyzer

An intelligent application that helps recruiters, HR professionals, and job seekers analyze resumes using AI.  
---

Features
- Resume Upload & Parsing: Upload resumes in PDF/DOCX format and extract structured data.
- AI-Powered Analysis: Evaluate resumes based on keywords, skills, and role-specific requirements.
- Role-Based Dashboards:
  - User: Upload and track resume performance.
  - Author: Manage templates and analysis rules.
  - Admin: Oversee system usage and manage users.
- Trash Bin: Deleted resumes are stored temporarily with restore options.
- Authentication: Secure login/register system with role-based access.
- Cloud Integration: Resume files stored and optimized using Cloudinary.
- Middleware Security: JWT-based token verification for protected routes.

--------------

Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- AI Integration: Google Gemini API for resume parsing & scoring
- File Handling: Multer for uploads, Cloudinary for storage
- Version Control: GitHub

-------------------------------------

Project Structure

Backend/
├── API/
│   ├── adminAPI.js
│   ├── commonAPI.js
│   └── resumeAPI.js
├── Models/
│   ├── ResumeSchema.js
│   └── UserSchema.js
├── config/
│   ├── cloudinary.js
│   └── multer.js
├── httpFiles/
│   ├── admin.http
│   ├── common.http
│   └── resume.http
├── middlewares/
│   └── verifyToken.js
├── uploads/
│   ├── hi.pdf
│   └── optimized-*.pdf
├── server.js
├── package.json
└── README.md


Frontend/
├── public/
├── src/
│   ├── Components/
│   │   ├── AdminProfile.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── ResumeOverview.jsx
│   │   ├── ScoreMeter.jsx
│   │   ├── Signin.jsx
│   │   └── TashInsp.jsx
│   ├── assets/
│   │   ├── LOGO.jpeg
│   │   ├── hero.png
│   │   ├── reactcg
│   │   ├── video.mp4
│   │   └── vite.svg
│   ├── store/
│   │   └── authStore.js
│   ├── styles/
│   ├── common.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── README.md
├── eslint.config.js
├── package-lock.json
├── package.json
└── vite.config.js



