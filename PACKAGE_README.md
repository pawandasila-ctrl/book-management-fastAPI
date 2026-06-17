# 📦 Book Management System - Complete Package

## What's Included

This is a complete, production-ready Book Management System with Docker support.

### 📋 Documentation Files
- **README.md** - Full project overview and features
- **QUICKSTART.md** - 5-minute quick start guide
- **INSTALLATION_GUIDE.md** - Detailed setup instructions with troubleshooting
- **DOCKER_GUIDE.md** - Complete Docker and Docker Compose guide

### 🛠️ Backend (FastAPI + SQL Server)
```
Backend/
├── app/                    # Main application code
│   ├── routers/           # API route handlers
│   ├── auth.py            # Authentication logic
│   ├── database.py        # Database configuration
│   ├── models.py          # Database models
│   ├── schemas.py         # Pydantic schemas
│   └── main.py            # FastAPI app setup
├── tests/                 # Pytest test cases
├── Dockerfile             # Container image definition
├── docker-compose.yml     # Development compose setup
├── docker-compose.prod.yml # Production compose setup
├── requirements.txt       # Python dependencies
├── .env.example           # Development environment template
├── .env.production        # Production environment template
└── run.sh                 # Start script
```

### 🎨 Frontend (React + Vite)
```
Client/
├── src/                   # React components
│   ├── App.jsx           # Main routing component
│   ├── Login.jsx         # Authentication page
│   ├── Books.jsx         # Books list/dashboard
│   ├── CreateBook.jsx    # Add book form
│   ├── UpdateBook.jsx    # Edit book form
│   ├── Nav.jsx           # Navigation component
│   └── main.jsx          # React entry point
├── public/               # Static assets
├── package.json          # Node.js dependencies
├── .env.example          # Frontend environment template
└── vite.config.js        # Vite configuration
```

---

## 🚀 Getting Started (5 Minutes)

### Prerequisites
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- Git (optional, if not already extracted)

### Quick Setup
```bash
# 1. Open terminal in Backend directory
cd Backend

# 2. Start services with Docker
docker compose up -d

# 3. Wait ~30-40 seconds for SQL Server to initialize
docker compose ps

# 4. In a new terminal, start frontend
cd ../Client
npm install
npm run dev

# 5. Open in browser
# Frontend: http://localhost:5173
# API Docs: http://localhost:5001/docs
```

---

## 📖 Documentation Guide

### For Quick Setup
👉 Read **QUICKSTART.md**

### For Detailed Installation
👉 Read **INSTALLATION_GUIDE.md**

### For Docker Understanding
👉 Read **DOCKER_GUIDE.md**

### For Full Documentation
👉 Read **README.md**

---

## 🔧 Configuration

### Development Setup
1. Copy `.env.example` to `.env` in Backend directory
2. Copy `Client/.env.example` to `Client/.env` (usually no changes needed)
3. Run: `docker compose up -d` in Backend directory

### Production Deployment
1. Update `Backend/.env.production` with production values
2. Use `Backend/docker-compose.prod.yml`:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

---

## 📝 Key Features

✅ **Authentication** - JWT-based user authentication  
✅ **CRUD Operations** - Create, read, update, delete books  
✅ **API Documentation** - Interactive Swagger UI  
✅ **Database** - SQL Server with persistent volumes  
✅ **Testing** - Backend and frontend tests included  
✅ **Docker Ready** - One-command deployment  
✅ **Production Ready** - Includes production config  

---

## 🧪 Running Tests

### Backend Tests
```bash
cd Backend
pytest -v
```

### Frontend Tests
```bash
cd Client
npm install
npm test
```

---

## 🌐 Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | User interface |
| API Swagger | http://localhost:5001/docs | API documentation |
| API ReDoc | http://localhost:5001/redoc | Alternative API docs |
| Database | localhost:1433 | SQL Server (dev only) |

---

## 💾 Database Credentials (Development)

- **User**: sa
- **Password**: Password@123
- **Port**: 1433
- **Initial Database**: master

**⚠️ Change these in production!**

---

## 📁 Project Structure

```
BookManagementSystem/
├── README.md                    # Main documentation
├── QUICKSTART.md                # Quick setup guide
├── INSTALLATION_GUIDE.md        # Detailed installation
├── DOCKER_GUIDE.md              # Docker documentation
├── Backend/                     # FastAPI backend
│   ├── app/                     # Application code
│   ├── tests/                   # Test cases
│   ├── Dockerfile               # Docker image
│   ├── docker-compose.yml       # Development compose
│   ├── docker-compose.prod.yml  # Production compose
│   ├── .env.example             # Dev config template
│   ├── .env.production          # Prod config template
│   └── requirements.txt         # Dependencies
└── Client/                      # React frontend
    ├── src/                     # Components
    ├── public/                  # Static files
    ├── package.json             # Dependencies
    └── .env.example             # Config template
```

---

## ⚠️ Important Notes

### Security
- **Never commit .env files** (use .env.example templates)
- **Change default passwords** before production
- **Update CORS origins** for your domain
- **Use HTTPS** in production

### Ports
- Backend: **5001**
- Frontend: **5173**
- Database: **1433**

Ensure these ports are available before starting.

### Database Persistence
Database files are stored in Docker volumes and persist even after containers stop.

To reset:
```bash
docker compose down -v
```

---

## 🐛 Troubleshooting

### Container exits immediately
→ Check INSTALLATION_GUIDE.md → Troubleshooting section

### Port already in use
→ See INSTALLATION_GUIDE.md → Common Error Messages

### Connection refused
→ Wait for SQL Server to initialize (~40 seconds)

### CORS errors
→ Verify VITE_API_BASE_URL in Client/.env

---

## 🚀 Deployment Options

### Local Development
```bash
docker compose up -d
npm run dev
```

### Docker Compose (Production)
```bash
docker compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
- Install Python 3.11+ and Node.js 18+
- See INSTALLATION_GUIDE.md for manual setup

### Cloud Deployment
- AWS ECS, Google Cloud Run, Azure Container Instances
- Use provided Docker images
- See DOCKER_GUIDE.md for container concepts

---

## 📞 Support & Help

1. Check **QUICKSTART.md** for common issues
2. Read **INSTALLATION_GUIDE.md** for detailed help
3. Review **DOCKER_GUIDE.md** for Docker issues
4. Check container logs:
   ```bash
   docker compose logs -f sqlserver
   docker compose logs -f backend
   ```

---

## 📊 Project Statistics

- **Backend**: FastAPI with SQLAlchemy ORM
- **Frontend**: React 18+ with Vite
- **Database**: Microsoft SQL Server 2022
- **Authentication**: JWT tokens
- **Testing**: Pytest + Playwright
- **Docker**: Multi-container orchestration

---

## 🎯 Next Steps

1. ✅ Extract this package
2. ✅ Read QUICKSTART.md
3. ✅ Run `docker compose up -d` in Backend
4. ✅ Run `npm install && npm run dev` in Client
5. ✅ Open http://localhost:5173 and start building!

---

## 📄 License

This project is provided as-is for your use.

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Status**: Production Ready ✅

Happy coding! 🚀
