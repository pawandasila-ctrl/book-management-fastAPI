# Installation Guide - Book Management System

Complete step-by-step guide to set up and run the Book Management System.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Docker Setup (Recommended)](#docker-setup-recommended)
3. [Manual Setup](#manual-setup)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB (6GB recommended for comfortable development)
- **Disk Space**: 5GB free
- **OS**: Windows, macOS, or Linux

### Required Software
- **Docker Desktop** (v24.0+) and **Docker Compose** (v5.1+)
  - OR Python 3.11+ and Node.js 18+

- **Git** (for cloning/version control)

---

## Docker Setup (Recommended)

### Step 1: Install Docker Desktop

#### Windows/macOS
1. Download from [Docker.com](https://www.docker.com/products/docker-desktop)
2. Run the installer and follow the setup wizard
3. Start Docker Desktop

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

### Step 2: Verify Docker Installation
```bash
docker --version
docker compose version
```

### Step 3: Clone/Prepare Project
```bash
cd /path/to/project/Backend
```

### Step 4: Start Services
```bash
# Start all services in background
docker compose up -d

# Check service status
docker compose ps

# Wait for SQL Server to be healthy (30-40 seconds)
# Status should show "healthy"
```

### Step 5: Verify Backend is Running
```bash
curl http://localhost:5001/docs
# Should return Swagger UI documentation
```

### Step 6: Start Frontend
```bash
cd ../Client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 7: Access Application
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:5001/docs
- **API ReDoc**: http://localhost:5001/redoc

---

## Manual Setup

### Backend Installation (Manual)

#### 1. Prerequisites
- Python 3.11+
- SQL Server 2022 (or higher)

#### 2. Virtual Environment Setup
```bash
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

#### 3. Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 4. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
nano .env  # or use your preferred editor
```

Sample .env file:
```env
SECRET_KEY=your-development-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=mssql+pyodbc://sa:YourPassword@localhost:1433/master?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
```

#### 5. Run Backend Server
```bash
uvicorn app.main:app --reload --port 5001
```

Output should show:
```
INFO:     Uvicorn running on http://127.0.0.1:5001
```

### Frontend Installation (Manual)

#### 1. Prerequisites
- Node.js 18+ and npm

#### 2. Install Dependencies
```bash
cd Client

npm install
```

#### 3. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env if needed
nano .env
```

Default .env:
```env
VITE_API_BASE_URL=http://localhost:5001
```

#### 4. Run Frontend Server
```bash
npm run dev
```

Output should show:
```
  VITE v4.x.x  ready in xxxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Verification

### Check Backend
```bash
# Test API connectivity
curl -X GET http://localhost:5001/docs

# Check health status
curl -X GET http://localhost:5001/api/health
```

### Check Frontend
Open browser: http://localhost:5173

### Check Database (Docker)
```bash
# View SQL Server logs
docker compose logs sqlserver

# Connect to SQL Server
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Password@123
```

---

## Verification Checklist

- [ ] Backend running on http://localhost:5001
- [ ] Frontend running on http://localhost:5173
- [ ] Database container is healthy
- [ ] Can access Swagger docs at /docs
- [ ] Can register/login in the application
- [ ] Can create/read/update/delete books

---

## Troubleshooting

### Docker Issues

#### Problem: SQL Server Container Exits Immediately
```bash
# Check logs
docker compose logs sqlserver

# Solution 1: Ensure enough memory
# Docker Desktop > Preferences > Resources > Memory: Set to 4GB+

# Solution 2: Restart services
docker compose down
docker compose up -d

# Solution 3: Reset database volume
docker compose down -v
docker compose up -d
```

#### Problem: Port Already in Use
```bash
# Find what's using the port
# Linux/macOS:
lsof -i :1433
lsof -i :5001

# Windows:
netstat -ano | findstr :1433
netstat -ano | findstr :5001

# Kill the process or change port in docker-compose.yml
```

#### Problem: Docker Daemon Not Running
- Start Docker Desktop application
- Or on Linux: `sudo systemctl start docker`

### Backend Issues

#### Problem: ModuleNotFoundError: No module named 'sqlalchemy'
```bash
# Ensure venv is activated, then reinstall
pip install -r requirements.txt --force-reinstall
```

#### Problem: Database Connection Error
1. Verify SQL Server is running: `docker compose ps`
2. Check DATABASE_URL in .env file
3. Verify credentials are correct
4. Test connection: 
   ```bash
   docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd -U sa -P Password@123
   ```

### Frontend Issues

#### Problem: npm modules not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Problem: Cannot connect to backend
1. Verify backend is running: `curl http://localhost:5001/docs`
2. Check VITE_API_BASE_URL in .env
3. Check CORS settings in backend/app/main.py
4. Browser console may show CORS error

#### Problem: Port 5173 already in use
```bash
# Change port in Client > vite.config.js:
# server: {
#   port: 5174
# }
```

### Common Error Messages

| Error | Solution |
|-------|----------|
| `Connection refused at 0.0.0.0:1433` | SQL Server not ready, wait 30-40s |
| `CORS error` | Update allowed origins in backend |
| `Module not found` | Run `npm install` or `pip install -r requirements.txt` |
| `Port already in use` | Change port or kill process using it |
| `Authentication failed` | Check username/password in connection string |

---

## Next Steps

1. **Create an account**: Register at http://localhost:5173
2. **Add books**: Create some test books
3. **Run tests**: 
   ```bash
   # Backend tests
   cd Backend && pytest
   
   # Frontend tests
   cd Client && npm test
   ```
4. **Read API Documentation**: Visit http://localhost:5001/docs

---

## Additional Commands

### Docker Compose Commands
```bash
# View logs
docker compose logs -f

# Stop services
docker compose stop

# Start services
docker compose start

# Restart services
docker compose restart

# Remove containers and volumes
docker compose down -v

# View service status
docker compose ps
```

### Backend Commands
```bash
# Run tests
pytest -v

# Run specific test file
pytest tests/test_api.py -v

# Generate coverage report
pytest --cov=app tests/
```

### Frontend Commands
```bash
# Build for production
npm run build

# Run tests with UI
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report

# Lint code
npm run lint
```

---

## Security Best Practices

⚠️ **Important**: For production deployment:

1. **Change Default Passwords**
   ```env
   MSSQL_SA_PASSWORD=strong-password-here
   SECRET_KEY=generate-strong-key
   ```

2. **Update CORS Origins**
   ```python
   allow_origins=["https://yourdomain.com"]
   ```

3. **Enable HTTPS**
   - Use reverse proxy (nginx, traefik)
   - Obtain SSL certificate (Let's Encrypt)

4. **Database Security**
   - Use environment variables for credentials
   - Restrict database user permissions
   - Regular backups

5. **API Security**
   - Implement rate limiting
   - Add API key authentication
   - Validate all inputs
   - Use prepared statements

---

## Support

If you encounter issues:

1. Check logs: `docker compose logs` or terminal output
2. Verify all prerequisites are installed
3. Ensure ports 1433, 5001, 5173 are available
4. Try restarting services: `docker compose restart`
5. Check error messages in console

---

**Happy coding! 🚀**
