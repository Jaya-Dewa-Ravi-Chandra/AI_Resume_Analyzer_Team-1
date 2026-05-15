
Directory Structure
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
├── httpfiles/
│   ├── admin.http
│   ├── common.http
│   └── resume.http
├── middlewares/
│   └── verifyToken.js
├── uploads/
├── server.js
├── package.json
├── package-lock.json
└── Readme.md
```

---

##  API/ Directory
**Purpose**: Core API route handlers for the application's main endpoints, organized by functionality.

### adminAPI.js
**Purpose**: Handles admin-specific operations and user management functionality.

**Key Features**:
- `GET /emails` - Fetches all users with details (email, name, profile image, role, status)
- `PUT /userStatus` - Block/unblock user accounts
- Requires ADMIN role verification via JWT token

**Security**: Protected by `verifyToken("ADMIN")` middleware to ensure only administrators can access these endpoints.

### commonAPI.js
**Purpose**: Authentication and general user operations API endpoints.

**Key Features**:
- `POST /register` - User registration (role defaults to "USER", password hashed with bcrypt)
- `POST /login` - User login (validates credentials, returns JWT token in HTTP-only cookie)
- `GET /logout` - Clears authentication token cookie
- `PUT /password` - Change password (requires authentication, validates current password)
- `GET /check-auth` - Verifies if user is authenticated

**Security**: Uses bcryptjs for password hashing and jsonwebtoken for secure authentication tokens.

### resumeAPI.js
**Purpose**: Main resume analysis and management API endpoints.

**Key Features**:
- `POST /upload` - Accepts PDF resume, extracts text, uses Google Gemini AI for analysis, generates ATS score, pros/cons, improvements, and creates optimized PDF
- `GET /resume` - Fetches all user resumes (non-deleted)
- `GET /resume/:id` - Fetches single resume details
- `PUT /softdelete/:id` - Soft delete (marks isDeleted: true)
- `PATCH /restore/:id` - Restores deleted resume
- `DELETE /permanent/:id` - Permanent deletion
- `GET /trash` - Fetches all deleted resumes
- `GET /download/:id` - Returns optimized resume download URL

**AI Integration**: Uses Google Generative AI (Gemini 2.5 Flash) for intelligent resume parsing, scoring, and optimization suggestions.

---

## Models/ Directory
**Purpose**: MongoDB data schemas defining the database structure and data validation.

### UserSchema.js
**Purpose**: Defines the user account data structure for MongoDB.

**Fields**:
- Email (unique)
- Password (hashed)
- First/last name
- Profile image URL
- Role (USER or ADMIN)
- Account status

**Features**: Tracks user registration details and account activation status for authentication and authorization.

### ResumeSchema.js
**Purpose**: Defines the resume analysis data structure for storing AI-processed resume information.

**Key Fields**:
- `userId` - Reference to the user who uploaded the resume
- `jobTitle` - Target job role for analysis
- `atsScore` - AI-calculated ATS score (1-100)
- `pros` - Array of resume strengths
- `cons` - Array of resume weaknesses
- `improvements` - Array of improvement suggestions with heading & content
- `graph` - Skills analysis data (top 5 skills with scores)
- `optimizedResume` - Structured resume data (personalInfo, summary, skills, projects, experience, education, certifications, achievements)
- `fileUrl` - Original PDF URL (stored in Cloudinary)
- `optimizedFileUrl` - AI-optimized PDF URL (stored in Cloudinary)
- `isDeleted` - Soft delete flag for trash functionality

**Timestamps**: Automatically tracks creation and update times.

---

## config/ Directory
**Purpose**: Configuration files for external services and file handling middleware.

### cloudinary.js
**Purpose**: Initializes and configures the Cloudinary cloud storage service for file uploads.

**Functionality**:
- Configures API credentials from environment variables (CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET)
- Enables cloud storage for original PDFs and optimized resumes
- Replaces local file storage with scalable cloud solution

**Validation**: Logs confirmation when credentials are successfully loaded.

### multer.js
**Purpose**: Configures file upload middleware for handling PDF uploads.

**Features**:
- Uses memory storage (stores files in RAM instead of disk)
- File type filtering to accept only PDF files
- Prevents non-PDF uploads with appropriate error messages
- Integrates with Express routes for secure file handling

---

##  httpfiles/ Directory
**Purpose**: HTTP request test files for manual API testing and development.

### admin.http, common.http, resume.http
**Purpose**: Pre-written HTTP requests for testing API endpoints without a frontend interface.

**Usage**:
- Copy/paste requests into VS Code REST Client extension or similar tools
- Test authentication, resume upload, and admin functionality
- Includes GET, POST, PUT, DELETE requests with proper headers and body examples

**Benefits**: Enables developers to test API endpoints directly during development and debugging.

---

## middlewares/ Directory
**Purpose**: Custom middleware functions for request processing, authentication, and security.

### verifyToken.js
**Purpose**: JWT token verification middleware for protecting API routes.

**Functionality**:
- Extracts JWT token from HTTP-only cookies
- Verifies token signature and expiration using jsonwebtoken
- Validates user roles against allowed access levels
- Attaches decoded user data to the request object (`req.user`)
- Returns appropriate 403/401 errors for unauthorized access

**Usage**: Applied to protected routes with role specification like `verifyToken("USER")` or `verifyToken("ADMIN")`.

**Security**: Critical component for preventing unauthorized API access and ensuring proper authentication.

---

## uploads/ Directory
**Purpose**: Temporary storage directory for uploaded PDFs and generated optimized resumes.

**Contents**:
- Sample PDF files (e.g., hi.pdf)
- Temporary optimized PDF files with timestamp naming (e.g., optimized-*.pdf)

**Note**: With Cloudinary integration for cloud storage, this directory may be used for temporary processing rather than permanent storage in production environments.

---

## 📄 server.js (Root File)
**Purpose**: Main Express application initialization and server configuration file.

**Key Features**:
- Configures CORS (Cross-Origin Resource Sharing) for frontend at `https://ai-resume-analyzer-team-1.vercel.app`
- Enables cookie parsing for JWT authentication handling
- Establishes MongoDB database connection using Mongoose
- Registers API route handlers:
  - `/commonApi` → commonAPI.js (authentication routes)
  - `/resumeApi` → resumeAPI.js (resume operations)
  - `/adminApi` → adminAPI.js (admin functions)
- Loads environment variables via dotenv
- Starts server on specified PORT (default 4000)

**Architecture**: Central hub that connects all components of the backend application.

---

## package.json
**Purpose**: Node.js project configuration file defining dependencies, scripts, and project metadata.

**Key Dependencies**:
- `express` - Web framework for building REST APIs
- `mongoose` - MongoDB object modeling and database interaction
- `bcryptjs` - Secure password hashing
- `jsonwebtoken` - JWT token generation and verification
- `cloudinary` - Cloud file storage service
- `multer` - File upload handling middleware
- `pdfkit` - PDF generation and manipulation
- `pdf-parse` - PDF text extraction
- `@google/generative-ai` - Google Gemini AI integration
- `cookie-parser` - HTTP cookie parsing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

**Scripts**: Defines npm commands for running, testing, and building the application.

---

## package-lock.json
**Purpose**: Automatically generated file that locks dependency versions for consistent installations.

**Function**: Ensures that `npm install` installs exact dependency versions across different environments, preventing version conflicts and ensuring reproducible builds.

---

## Readme.md
**Purpose**: Project documentation file with setup instructions and important notes.

**Contents**:
- Basic setup and installation instructions
- Environment variable configuration
- API endpoint documentation
- Frontend integration notes
- Reminders about filename and job title requirements

---

## Architecture Summary

**Technology Stack**: Node.js + Express.js REST API with MongoDB database

**External Services**: 
- Google Gemini AI for intelligent resume analysis
- Cloudinary for secure file storage
- JWT for stateless authentication

**Core Workflow**: 
1. User registration and authentication
2. PDF resume upload and text extraction
3. AI-powered analysis (ATS scoring, pros/cons, improvements)
4. Optimized resume generation and cloud storage
5. Resume management (view, download, delete/restore)

This backend provides a complete AI-powered resume analysis service with secure authentication, file handling, and comprehensive resume optimization features.
