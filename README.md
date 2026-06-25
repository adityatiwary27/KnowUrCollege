<div align="center">
  <h1>🎓 KnowUrCollege</h1>
  <p>A beautifully designed, full-stack social media application specifically engineered for college communities.</p>

  <p>
    <a href="https://know-ur-college.vercel.app"><b>View Live Website</b></a>
    ·
    <a href="https://knowurcollege.onrender.com/api/posts"><b>View Live API</b></a>
  </p>
</div>

---

## 🌟 Overview

**KnowUrCollege** empowers students to share campus moments, interact with peers, and stay connected. It features a modern, responsive **Cyber-Neon** aesthetic built with Next.js and TailwindCSS, backed by a robust, secure Java Spring Boot API. 

## ✨ Key Features

- **Cyber-Neon UI**: A stunning, fully responsive interface optimized for Mobile, Tablet, and Desktop screens featuring dynamic Dark/Light modes.
- **AI Caption Generation**: Seamlessly integrated with **Google Gemini AI** to automatically generate creative, contextual captions and hashtags based on uploaded images.
- **Secure Authentication**: End-to-end JWT (JSON Web Token) authentication for completely secure login, registration, and session management.
- **Photo Uploading**: High-performance image uploading and hosting utilizing **Cloudinary** for fast, globally optimized media delivery.
- **Interactive Feed & Profile**: Scroll through the global campus feed or manage your personal gallery using a Pinterest-style masonry grid layout.
- **Follow System**: Connect with other students by following their profiles and keeping up with their latest updates.

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js (React 18)
- **Styling**: TailwindCSS (v4)
- **State Management**: React Hooks & Axios Interceptors
- **Deployment**: Vercel

### Backend
- **Framework**: Spring Boot (Java 21)
- **Database**: PostgreSQL (Serverless via Neon.tech)
- **Media Storage**: Cloudinary
- **AI Engine**: Google Gemini API
- **Deployment**: Docker Container on Render

## ⚙️ Local Development Setup

If you wish to run the application locally, follow these instructions:

### 1. Backend Setup
1. Clone the repository and navigate to the project root.
2. Ensure you have **Java 21** and Maven installed.
3. Configure your local `src/main/resources/application.properties` with your PostgreSQL database credentials and API keys:
   ```properties
   # Database
   spring.datasource.url=jdbc:postgresql://localhost:5432/yourdb
   spring.datasource.username=your_user
   spring.datasource.password=your_password
   
   # External APIs
   gemini.api.key=YOUR_GEMINI_API_KEY
   app.cloudinary.url=cloudinary://YOUR_API_KEY:YOUR_API_SECRET@YOUR_CLOUD_NAME
   ```
4. Run the Spring Boot server:
   ```bash
   mvn spring-boot:run
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variable by creating a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE=http://localhost:8081/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).