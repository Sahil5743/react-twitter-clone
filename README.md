# 🐦 React Twitter Clone

A full-stack Twitter-like social media web application built using **React (Vite)** for the frontend, **Node.js/Express** for the backend, and **MongoDB Atlas** as the database. This project supports essential Twitter features like posting tweets, authentication, user profiles, and real-time notifications.

---

## 🚀 Features

- 🔐 Authentication: Sign up, log in, and secure routes using JWT
- 📝 Tweeting: Post, delete, and view tweets
- 👤 User Profiles: View user details and tweets
- 🔔 Notifications: Real-time notification support (to be implemented)
- 📱 Responsive Design: Mobile-friendly UI with Tailwind CSS
- 🔗 RESTful API: Cleanly structured backend endpoints

---

## 🛠️ Tech Stack

### Frontend
- React (with Vite)
- Tailwind CSS
- React Router
- Context API

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (Authentication)

---

## 📁 Project Structure
twitter/
├── backend/ # Express backend
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── index.js
├── frontend-vite/ # React frontend (Vite)
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── contexts/
│ │ ├── pages/
│ │ └── main.jsx
├── .gitignore
├── README.md

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Sahil5743/react-twitter-clone.git
cd react-twitter-clone
Backend Setup
cd backend
npm install
Create a .env file inside backend with the following contents:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
Then run the backend:
npm run dev
Frontend Setup:
cd ../frontend-vite
npm install
npm run dev
📜 License
This project is licensed under the MIT License.
See the LICENSE file for more details.
✅ Future Improvements
Comments on tweets

-> Likes and retweets
-> Image uploads
-> Real-time WebSocket support
-> Search and trending hashtags

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
