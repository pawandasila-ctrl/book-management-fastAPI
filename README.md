# Simple Book Management System (FastAPI + React)

This project consists of a FastAPI backend and a React frontend.

## 🚀 Backend Setup

You can run the backend using **Docker (recommended)** or **locally**.

### Option 1: Docker (with MS SQL Server)
1. Go to the Backend folder:
   ```bash
   cd Backend
   ```
2. Start the services:
   ```bash
   docker compose up -d
   ```
   * The backend will run at `http://localhost:5001`.
   * Interactive API docs: `http://localhost:5001/docs`.

### Option 2: Local Run (with SQLite fallback)
1. Go to the Backend folder:
   ```bash
   cd Backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   bash run.sh
   # Or: uvicorn app.main:app --host 0.0.0.0 --port 5001 --reload
   ```

---

## 💻 Frontend Setup (React)

1. Go to the Client folder:
   ```bash
   cd Client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   * The frontend will run at `http://localhost:5173`.
