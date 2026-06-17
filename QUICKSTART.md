# 🚀 QUICK START GUIDE - Book Management System

Get the application running in **5 minutes** using Docker!

## Prerequisites
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** (to clone the project)

## 3-Step Setup

### Step 1: Navigate to Backend Directory
```bash
cd Backend
```

### Step 2: Start Services with Docker
```bash
docker compose up -d
```

Wait for ~30-40 seconds for SQL Server to initialize.

### Step 3: Verify Services
```bash
docker compose ps
# Look for 'healthy' status for sqlserver
```

## Start Frontend

### Step 1: Open New Terminal
```bash
cd Client
```

### Step 2: Install & Run
```bash
npm install
npm run dev
```

## 🎉 Application Ready!

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **API Docs** | http://localhost:5001/docs |
| **API ReDoc** | http://localhost:5001/redoc |
| **Database** | localhost:1433 (SA / Password@123) |

## First Steps

1. Open http://localhost:5173 in your browser
2. Click **Register** to create an account
3. Add some books to get started
4. Click **Swagger Docs** for API documentation

## 🛑 Common Issues

### SQL Server Container Exits
```bash
# Check logs
docker compose logs sqlserver

# Restart
docker compose down -v
docker compose up -d
```

### Port Already in Use
```bash
# Linux/Mac: Find what's using port
lsof -i :1433
lsof -i :5001

# Windows
netstat -ano | findstr :1433
netstat -ano | findstr :5001
```

## 📚 Documentation

- **README.md** - Full project overview
- **INSTALLATION_GUIDE.md** - Detailed setup instructions
- **DOCKER_GUIDE.md** - Docker and Docker Compose guide
- **Backend README** - API documentation in Backend/README.md
- **Client README** - Frontend setup in Client/README.md

## 🧪 Running Tests

### Backend Tests
```bash
cd Backend
pytest -v
```

### Frontend Tests
```bash
cd Client
npm test
```

## 🔌 Docker Commands Reference

```bash
# View services
docker compose ps

# View logs
docker compose logs -f

# Stop services
docker compose stop

# Restart services
docker compose restart

# Stop and remove everything
docker compose down -v
```

## 💾 Database Connection (Optional)

If you need to connect to SQL Server directly:

```bash
# Using Docker
docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Password@123

# Or use your favorite SQL client:
# Server: localhost,1433
# Username: sa
# Password: Password@123
```

## 📖 Next Steps

1. Read **README.md** for complete documentation
2. Check **INSTALLATION_GUIDE.md** for troubleshooting
3. Review **DOCKER_GUIDE.md** for Docker concepts
4. Explore API at http://localhost:5001/docs

## ⚠️ Important Notes

- **Change default passwords** before production deployment
- Database data persists in Docker volumes even after container stop
- CORS is configured for localhost - update for production
- JWT tokens expire after 60 minutes (configurable in .env)

---

**For detailed help, see INSTALLATION_GUIDE.md**

Happy coding! 🎉
