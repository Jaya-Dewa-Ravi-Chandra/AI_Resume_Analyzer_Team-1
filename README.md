# AI-Powered Resume Analyzer

An intelligent web application that helps recruiters, HR professionals, and job seekers analyze resumes using AI.  
Built with **React**, **Tailwind CSS**, and integrated with AI models for resume parsing, scoring, and recommendations.

---

## Features
- **Resume Upload & Parsing**: Upload resumes in PDF/DOCX format and extract structured data.
- **AI-Powered Analysis**: Evaluate resumes based on keywords, skills, and role-specific requirements.
- **Role-Based Dashboards**:
  - **User**: Upload and track resume performance.
  - **Admin**: Oversee system usage and manage users.
- **Trash Bin**: Deleted resumes are stored temporarily with restore options.
- **Responsive UI**: Clean, modern interface built with Tailwind CSS.
- **Authentication**: Secure login/register system with role-based access.

---

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js / Express (or your chosen backend)
- **Database**: MongoDB / PostgreSQL
- **AI Integration**: NLP models for resume parsing & scoring
- **Version Control**: GitHub

---

## Project Structure

```
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
```
```
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
```


