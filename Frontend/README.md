
### Directory Structure
```
Frontend/
├── src/
│   ├── Components/
│   │   ├── AdminProfile.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── ResumeOverview.jsx
│   │   ├── ScoreMeter.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── TrashBin.jsx
│   ├── assets/
│   │   ├── LOGO.jpeg
│   │   ├── hero.png
│   │   ├── reactcg/
│   │   ├── video.mp4
│   │   └── vite.svg
│   ├── store/
│   │   └── authStore.js
│   ├── styles/
│   │   └── common.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## Root Directory Files

### package.json
**Purpose**: Node.js project configuration file defining dependencies, build scripts, and project metadata.

**Key Content**:
- Project metadata (name, version, type)
- Dependencies: React, React Router, Axios, React Dropzone, Recharts, Zustand (state management), Tailwind CSS
- Dev Dependencies: Vite, ESLint, Tailwind CSS Vite plugin
- Scripts for development (`npm run dev`), building (`npm run build`), linting (`npm run lint`)
- Specifies Node version requirements

### vite.config.js
**Purpose**: Vite build tool configuration for development and production builds.

**Configuration**:
- Enables React plugin via `@vitejs/plugin-react` for HMR (Hot Module Replacement)
- Integrates Tailwind CSS via `@tailwindcss/vite` for utility-first CSS styling
- Optimizes development server performance and build output

### eslint.config.js
**Purpose**: ESLint configuration for code quality and consistency.

**Configuration**:
- Applies JavaScript recommended rules via `eslint:js.configs.recommended`
- Enables React Hooks linting rules via `eslint-plugin-react-hooks`
- Integrates React Refresh plugin for fast refresh during development
- Excludes `dist` directory from linting

### index.html
**Purpose**: HTML entry point for the React application.

**Content**:
- Standard HTML5 boilerplate
- Meta tags for charset, viewport (responsive design)
- Single root div (`id="root"`) where React mounts the entire application
- Script tag that imports `main.jsx` module

### README.md
**Purpose**: Frontend project documentation.

**Content**:
- React + Vite template documentation
- ESLint configuration guidelines
- React Compiler notes and performance considerations
- TypeScript integration recommendations

---

## src/ Directory (Source Code)

### main.jsx
**Purpose**: React application entry point that bootstraps the app.

**Functionality**:
- Imports React StrictMode for highlighting potential issues in development
- Creates React root and mounts App component to the DOM
- Imports global styles from `index.css`

### App.jsx
**Purpose**: Main routing component that defines all application routes and navigation structure.

**Key Routes**:
- `/` → **Home** (public landing page)
- `/signin` → **SignIn** (authentication)
- `/signup` → **SignUp** (user registration)
- `/dashboard` → **Dashboard** (user resume upload interface)
- `/trash` → **TrashBin** (deleted resumes management)
- `/resume/:id` → **ResumeOverview** (individual resume analysis view)
- `/admin` → **AdminProfile** (admin user management dashboard)

**Features**:
- Uses React Router for client-side navigation
- Implements authentication check on app load via `useAuth()` hook
- Manages user session state globally

### index.css
**Purpose**: Global CSS styles and font imports.

**Content**:
- Imports Google Fonts: Manrope, Montserrat, Roboto
- Tailwind CSS directives
- Global font family set to Roboto for consistency across the application

---

## Components/ Directory (React Components)

### Home.jsx
**Purpose**: Public landing page showcasing the application features.

**Content**:
- Hero section with compelling headline: "AI Resume Analyzer - Smarter CVs, Faster Decisions"
- Value proposition: Stop scanning endless CVs with AI-powered resume analysis
- Call-to-action buttons linking to Sign In/Sign Up
- Demo video section embedded from `assets/video.mp4`
- Responsive design using Tailwind CSS (mobile and desktop layouts)
- Navigation header with logo and authentication links

### SignIn.jsx
**Purpose**: User login form with authentication.

**Features**:
- Email and password input fields with validation
- Form state management using React hooks
- Email format validation (checks for @ symbol)
- Error handling and display
- Loading state during authentication request
- Role-based redirection:
  - Admins → `/admin` dashboard
  - Regular users → `/dashboard`
- Integration with `useAuth()` store for state management
- Automatic redirect if already authenticated

### SignUp.jsx
**Purpose**: User registration form for new account creation.

**Features**:
- Multi-field form: first name, last name, email, password
- Client-side validation for all required fields
- Password strength/confirmation (inferred from typical signup flows)
- Loading state during registration
- Error display and handling
- Integration with `useAuth()` for registration logic
- Redirect to dashboard on successful signup

### Dashboard.jsx
**Purpose**: Main user dashboard for resume upload and management.

**Key Sections**:
1. **Upload Card**: 
   - Input field for job title/role
   - Drag-and-drop zone for PDF files (accepts only .pdf format)
   - File upload button triggering multipart form data submission
   - Visual feedback for drag-active state

2. **Uploaded Files Card**:
   - Lists all user's uploaded resumes
   - Shows filename and target job title for each resume
   - Action buttons: View (navigate to `/resume/:id`) and Delete (soft delete)
   - Empty state message if no files uploaded

3. **UI Elements**:
   - Header with logo and logout button
   - Loading spinner while AI processes resume
   - Progress dots animation during optimization
   - Success message indicating AI analysis in progress
   - Trash bin button for accessing deleted resumes

**Functionality**:
- Fetches user's resumes on component mount
- Uploads resume with job title to backend
- Handles authentication checks and redirects unauthenticated users
- Shows loading states and error handling

### ResumeOverview.jsx
**Purpose**: Comprehensive resume analysis and visualization dashboard.

**Dashboard Grid Sections**:
1. **ATS Score Display**: Score Meter component showing AI-calculated ATS score (1-100 scale)
2. **Skills Analysis**: Bar chart (via Recharts) displaying top 5 skills with scores
3. **Pros Section**: Green header card listing resume strengths identified by AI
4. **Cons Section**: Red header card listing resume weaknesses identified by AI
5. **Improvements Section**: Actionable suggestions with heading and detailed content
6. **Original Resume Preview**: Embedded PDF viewer showing original uploaded resume
7. **Enhanced Resume Preview**: Shows optimized PDF with AI improvements

**Features**:
- Fetches detailed resume data by ID from backend
- Responsive grid layout (sm: and responsive breakpoints)
- Navigation buttons: Back to Dashboard, Sign Out
- Download capability for both original and optimized PDFs
- Visual hierarchy with color-coded sections (green for pros, red for cons)
- Scrollable sections for managing large amounts of data

### AdminProfile.jsx
**Purpose**: Admin dashboard for user management and system oversight.

**Features**:
1. **Header Section**:
   - Admin profile info with avatar/initials
   - Welcome message
   - Logout button

2. **User Management Table**:
   - Displays all registered users with columns: Name, Email, Status, Actions
   - Shows user profile images (or initials if no image)
   - Status display (Active/Blocked)

3. **User Actions**:
   - Block/unblock users via toggle buttons
   - Real-time status updates
   - User role display

**Functionality**:
- Fetches all users from `/adminApi/emails` endpoint
- Handles user status updates (block/unblock)
- Loading and error states
- Empty state message when no users exist
- Role-based access control (ADMIN only)

### TrashBin.jsx
**Purpose**: Manage deleted resumes with restore and permanent delete options.

**Features**:
- Lists all soft-deleted resumes
- For each resume:
  - Displays filename
  - **Restore button**: Moves resume back to active list (PATCH `/resumeApi/restore/:id`)
  - **Delete button**: Permanently removes resume from database (DELETE `/resumeApi/permanent/:id`)
- Empty state message if no deleted files
- Back button to return to dashboard
- Fetches trash data on component mount

### ScoreMeter.jsx
**Purpose**: Visual component for displaying ATS score on a gauge/meter.

**Likely Features**:
- Circular gauge display showing 0-100 score
- Color coding (red for low scores, green for high scores)
- Numerical score display
- Animated transition when score updates

---

## store/ Directory (State Management)

### authStore.js
**Purpose**: Global authentication state management using Zustand.

**State Properties**:
- `isAuthenticated`: Boolean indicating if user is logged in
- `currentUser`: Object containing user profile data (email, firstName, lastName, role, profileImageUrl)
- `loading`: Loading state during auth operations
- `error`: Error message from failed operations

**Methods**:
- `checkAuth()`: Verifies current session with backend
- `login(email, password)`: Authenticates user via POST request
- `logout()`: Clears user session and redirects
- `signup(userData)`: Creates new user account

**Integration**:
- Used across all components via `useAuth()` hook
- Persists authentication state across page reloads
- Manages role-based access control

---

## styles/ Directory (Styling Utilities)

### common.js
**Purpose**: Centralized Tailwind CSS class constants for consistent styling.

**Exports**:
- `pageWrapper`: Base styling for full-page containers
- `pageTitleClass`: Styling for main page headings (4xl, bold, dark gray)
- `errorClass`: Red text styling for error messages
- `loadingClass`: Centered gray text for loading states
- `emptyStateClass`: Centered gray text for empty data states

**Benefit**: Ensures consistent styling across components and reduces code duplication

---

## assets/ Directory (Static Resources)

### LOGO.jpeg
**Purpose**: Application logo used in header/navigation across all pages.

**Usage**: Imported in Home, Dashboard, ResumeOverview, and AdminProfile components.

### video.mp4
**Purpose**: Demo video showing application features on the Home page.

**Usage**: Embedded in hero section with autoplay and loop attributes.

### Other Assets
- `hero.png`: Hero image for marketing/branding
- `reactcg/`: Folder containing React-related images/graphics
- `vite.svg`: Vite framework logo

---

## public/ Directory
**Purpose**: Static files served directly without processing.

**Common Contents**:
- `favicon.svg`: Browser tab icon
- Any other static resources needed at root level

---

## Summary of Key Technologies

- **Framework**: React with Hooks
- **Styling**: Tailwind CSS + Vite plugin
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios with credentials support
- **UI Components**: Custom components + Recharts for charts
- **Build Tool**: Vite
- **File Upload**: React Dropzone for drag-and-drop functionality
- **Linting**: ESLint with React plugins

---

## Data Flow Overview

1. User lands on **Home** page
2. Signs in/up → redirects to **Dashboard** or **Admin**
3. **Dashboard** allows resume upload with job title
4. Backend processes resume with AI (Gemini API)
5. User views analysis in **ResumeOverview** with ATS score, pros/cons, improvements
6. Users can delete resumes (soft delete) → visible in **TrashBin**
7. **TrashBin** allows restore or permanent deletion
8. **Admin** can view all users and manage their status
