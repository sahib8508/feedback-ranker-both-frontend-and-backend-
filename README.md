# Feedback Ranker

A full-stack web application that allows students to submit feedback about their colleges, and lets college organizations view AI-analyzed feedback summaries and rankings.

---

## Project Structure

```
Feedback Ranker/
├── frontend/        React application
└── backend/         Flask REST API
```

---

## Features

- Student feedback submission with roll number verification
- AI-powered feedback analysis using HuggingFace and TextBlob sentiment analysis
- College dashboard with ranked feedback summaries
- Organization registration and login
- Library book request system
- College resource upload and download
- Email notifications via SMTP
- Super admin panel
- Dark mode support
- Profanity filtering (English and Hindi)

---

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Firebase (Auth, Firestore, Storage)
- Recharts
- PapaParse
- Lucide React

### Backend
- Python / Flask
- Firebase Admin SDK
- TextBlob
- NLTK
- Pandas
- Groq
- Gunicorn

### Infrastructure
- Frontend: Firebase Hosting
- Backend: Render
- Database: Firebase Firestore
- Storage: Firebase Storage

---

## Getting Started

### Prerequisites

- Node.js 16 or above
- Python 3.9 or above
- A Firebase project with Firestore and Storage enabled

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```
HUGGINGFACE_API_KEY=your_key_here
FLASK_APP=app.py
FLASK_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_cert_url
EMAIL_SENDER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

Run the backend:

```bash
flask run
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```
REACT_APP_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Health check |
| GET | /health | Service status |
| POST | /verify_student | Verify student by roll number |
| POST | /api/ai_feedback_summary | Generate AI feedback summary |
| GET | /api/dashboard_data | Get college dashboard data |
| GET | /api/colleges | List all colleges |
| GET | /api/departments | List departments |
| POST | /request_book | Submit library book request |
| POST | /send_feedback_response | Send email response to feedback |
| POST | /send_email | Send general email |
| GET | /api/resources | Get college resources |
| POST | /api/resources/upload | Upload a resource |
| GET | /api/feedback_stats | Get feedback statistics |
| GET | /api/college_stats | Get college-level statistics |

---

## Deployment

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set Root Directory to `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn app:app`
5. Add all environment variables from `.env` in the Render dashboard under Environment

### Frontend (Firebase Hosting)

```bash
cd frontend
npm run build
firebase deploy
```

---

## Environment Variables

Never commit `.env` files or `firebase_key.json` to version control. Both are listed in `.gitignore`. Store all secrets in your hosting provider's environment variable settings.

---

## License

This project was built as a 6th semester college project.
