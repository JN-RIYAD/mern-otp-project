# MERN OTP Project

A basic **Sign-Up System** built with MERN stack where users can register with an email and password, receive a One-Time Password (OTP) via email, and verify their account.

---

## **Features**

- User registration with email and password.
- Email OTP verification.
- Password hashing with **bcrypt**.
- Email sending using **Nodemailer** (Gmail SMTP).
- MongoDB database to store users and OTPs.
- Frontend built with **React.js**.
- Backend built with **Node.js + Express.js**.
- OTP expiration and resend functionality.

---

## **Project Structure**

MERN_OTP_PROJECT/
│
├── client/ # React frontend
│ ├── src/
│ └── package.json
│
├── server/ # Node + Express backend
│ ├── models/
│ ├── routes/
│ ├── db.js
│ ├── index.js
│ ├── package.json
│ └── .env # Not included in GitHub (gitignored)
│
├── .gitignore
└── README.md



---

## **Getting Started**

### Clone the repository

```bash
git clone <https://github.com/JN-RIYAD/mern-otp-project.git>
cd MERN_OTP_PROJECT
cd server
npm install
```
Make .env in server folder
```
PORT=8080
DB=mongodb+srv://jnriyad:riyad3376@cluster0.lyhaldk.mongodb.net/mern_otp?retryWrites=true&w=majority&appName=Cluster0

EMAIL_USER=jn.riyad76@gmail.com
EMAIL_PASS=vqps wlro hwqs ppuk
```
Start the backend:
```
npm run dev

The backend should run at: http://localhost:8080
```
###Frontend
```
cd MERN_OTP_PROJECT
cd client
npm install
npm start
```
The React app should open at: http://localhost:3000


How to Test----

Go to the Sign Up page.

Enter your email and password.

Check your email for the OTP.

Go to the Verify OTP page and enter your OTP.

If successful, you will see a confirmation message.



Technologies Used---

React.js
Node.js + Express.js
MongoDB Atlas
Nodemailer
bcrypt
dotenv

Md. Jannatun Nayem Riyad
