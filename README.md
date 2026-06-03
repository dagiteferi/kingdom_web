# Heaven on Earth Kingdom Family Ministries

Welcome to the official web platform for Heaven on Earth Kingdom Family Ministries. This platform is built to connect our community, share updates, manage church ministries, and gather prayer requests all in one centralized place.

## How It's Built

This project is organized into two main sections:

1. **Frontend**: A fast, interactive user interface built with React and Vite. We use TailwindCSS for clean styling and Framer Motion to handle smooth visual animations. It also supports both English and Amharic languages natively.
2. **Backend**: A reliable Content Management System (CMS) powered by Python's FastAPI. All of our data is stored securely in a PostgreSQL database using SQLAlchemy.

## Getting Started Locally

If you want to run the project on your own computer for development or testing, follow the steps below.

### 1. Running the Frontend

You will need to have Node.js installed on your machine.

Open your terminal and type the following commands:

```bash
cd frontend
npm install
npm run dev
```

Once the server is running, open your web browser and go to `http://localhost:5173`.

### 2. Running the Backend

The backend runs on Python and requires an active PostgreSQL database. 

Open a new terminal tab and type:

```bash
cd backend
```

Since the backend requires a bit more setup (like virtual environments and database credentials), you can find the step-by-step instructions inside the `backend/README.md` file.

## Key Features

- **Public Website**: Visitors can read about our history, browse the image gallery, and stay up to date on upcoming events.
- **Prayer & Testimonies**: A dedicated space where users can submit prayer requests and share their testimonies with the church family.
- **Admin Dashboard**: A secure backend portal for authorized staff to manage content, approve posts, and handle site settings.
- **Bilingual Support**: Built from the ground up to support both English and Amharic, making sure everyone in our community feels welcome.

## Feedback and Support

If you run into any issues, spot a bug, or have a suggestion for how we can make this platform better, please feel free to open an issue in this repository. 
