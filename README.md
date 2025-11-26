# 🌟 Gem AI – Intelligent Blogging Platform

A comprehensive **full-stack AI-powered blogging platform** designed to deliver an enterprise-grade content creation and management experience. Built using the **MERN stack**, Gem AI offers secure authentication, admin-level moderation tools, rich text publishing, user analytics, and an elegant UI/UX optimized for creators.

![Gem AI Banner](./client/src/assets/git_banner_gemai.png)

---

## 📌 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Screenshots](#-screenshots)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)
- [Support](#-support)

---

## 🛡️ Badges  
<p align="left">
  <img src="https://img.shields.io/github/stars/vedant0706/Gem-AI?style=flat-square" />
  <img src="https://img.shields.io/github/forks/vedant0706/Gem-AI?style=flat-square" />
  <img src="https://img.shields.io/github/issues/vedant0706/Gem-AI?style=flat-square" />
  <img src="https://img.shields.io/github/pull-requests/vedant0706/Gem-AI?style=flat-square" />
  <img src="https://img.shields.io/badge/MERN-Full%20Stack-green?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" />
</p>

---

## 🌟 Features

### Core Capabilities
- **Secure Authentication System** (JWT, bcrypt, OTP email verification)
- **Rich Text Markdown Editor** (Quill + Markdown rendering)
- **Comprehensive Analytics Dashboard**
- **Admin Moderation Panel**
- **User Commenting & Engagement System**

### Authentication & Security
- JWT-based protected routes  
- Email verification using Nodemailer  
- Encrypted passwords with bcryptjs  
- Secure HTTP-only cookies  
- Admin-protected routes  
- CORS safety & input validation  

### Content Management
- Autosave-enabled rich text editor  
- Real-time Markdown preview  
- Drafts and version management  
- ImageKit CDN integration  

### Admin Tools
- Role-based access control (RBAC)  
- Approve/Reject user blogs  
- Comment moderation panel  
- User activity monitoring  

### User Dashboard
- Blog analytics  
- Engagement insights  
- Draft manager  
- A clean activity UI  

### Modern UI/UX
- TailwindCSS responsive design  
- Lucide-React icons  
- Smooth transitions  
- Toast notifications (React Toastify)

---

## 🛠️ Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

### **Backend**
![Node](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)

**Other Libraries**
Axios • Quill • Marked • Moment.js • bcryptjs • JWT • Nodemailer • Multer • ImageKit • Cookie Parser  

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v14+)  
- MongoDB Atlas  
- ImageKit account  
- Email SMTP credentials  

---

## 📥 Installation

### **1. Clone Repository**
```bash
git clone https://github.com/vedant0706/Gem-AI.git
cd Gem-AI
2. Install Server Dependencies
bash
Copy code
cd server
npm install
3. Install Client Dependencies
bash
Copy code
cd ../client
npm install
4. Environment Setup
Create .env inside server:

ini
Copy code
PORT=3000
NODE_ENV=production
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
CLIENT_URL=http://localhost:5173
Create .env inside client:

ini
Copy code
VITE_BACKEND_URL=http://localhost:3000
5. Run the Application
Start Backend
bash
Copy code
cd server
npm start
Start Frontend
bash
Copy code
cd client
npm run dev
📁 Project Structure
java
Copy code
GEM AI/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── git_banner_gemai.png
│   │   │   ├── login_page.png
│   │   │   ├── dashboard_page.png
│   │   │   └── admin_blog_page.png
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
└── README.md
```

🎯 Usage
For Users
Sign up with email verification

Create, edit, and delete blogs

Save drafts

Comment on blogs

Track blog analytics

For Admins
Approve/reject posts

Manage comments

Monitor users

Oversee platform activity

🔒 Security Features
JWT Authentication

bcryptjs password hashing

HTTP-only cookies

Role-based Access Control

OTP-based Email Verification

Sanitized Inputs

CORS Protection

🌐 Deployment
Frontend – Vercel
bash
Copy code
vercel deploy --prod
Backend – Vercel
Follow hosting provider steps.

🖼️ Screenshots
🔹 Login Page
![Login Page](./client/src/assets/login_page.png)


🔹 Dashboard
![Dashboard Page](./client/src/assets/dashboard_page.png)


🔹 Admin Blog Management
![Admin Blog Page](./client/src/assets/admin_blog_page.png)


👨‍💻 Author
Vedant Jadhav

GitHub: https://github.com/vedant0706

LinkedIn: https://www.linkedin.com/in/vedant-jadhav-0b1947340

Portfolio: https://jadhavvedant.vercel.app

🙏 Acknowledgments
React Community

MongoDB Docs

TailwindCSS Team

Open-Source Contributors

📞 Support
For help or issues, contact:
Email: vedantjadhav173@gmail.com
Or open a GitHub issue.

<p align="center"><b>Made with ❤️ by Vedant Jadhav</b></p>
