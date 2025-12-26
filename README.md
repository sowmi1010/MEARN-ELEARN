MERN e-Learn Platform

An online learning platform built using the MERN Stack (MongoDB, Express, React, Node.js).
It supports Students, Mentors, and Admins, providing features like video-based courses, live class, quizzes, certificates, and dashboard analytics.

Live Features

✨ Multi-role authentication — Student, Mentor, Admin
✨ Students can enroll, watch video lessons & take tests
✨ Mentors can upload courses, videos, PDFs & quizzes
✨ Admin approval system for courses & mentors
✨ Live class communication (Chat / WebSocket)
✨ Auto-generated PDF certificate after completion
✨ Progress tracking dashboard
✨ File upload – videos & PDFs stored in cloud
✨ Email notifications

User Role Flow

Student Flow

1️⃣ Sign up / Login
2️⃣ Browse & enroll in a course
3️⃣ Watch videos + access PDFs
4️⃣ Attend live class + chat
5️⃣ Take quizzes / tests
6️⃣ Finish course → Download certificate
7️⃣ View progress & course history

Mentor Flow

1️⃣ Login as mentor
2️⃣ Create & upload courses
3️⃣ Upload videos, PDFs, quizzes
4️⃣ Conduct live classes
5️⃣ Track enrolled students


Admin Flow

1️⃣ Login as admin
2️⃣ Manage users (students & mentors)
3️⃣ Approve / reject courses before publishing
4️⃣ Edit subjects, categories, languages
5️⃣ View analytics (enrollment, revenue, top courses)


System Architecture (Simple Overview)

React Frontend  →  Node.js Express API  →  MongoDB Database
                           │
                           ├── AWS S3 – Video & PDF storage
                           ├── Socket.IO – Real-time live classes / chat
                           └── Nodemailer – Email + Certificates

Tech Stack

| Layer        | Technologies                                            |
| ------------ | ------------------------------------------------------- |
| Frontend     | React, Tailwind CSS, Redux Toolkit, React Router        |
| Backend      | Node.js, Express.js, REST API, JWT Auth                 |
| Database     | MongoDB Atlas                                           |
| File Storage | AWS S3 / Firebase Storage                               |
| Realtime     | Socket.IO / Redis                                       |
| Email        | Nodemailer                                              |
| Deployment   | Vercel (Frontend), Render / Railway / AWS EC2 (Backend) |



