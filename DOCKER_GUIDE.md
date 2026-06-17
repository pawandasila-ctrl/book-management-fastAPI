# Docker Setup Guide

Complete guide to using Docker and Docker Compose with the Book Management System.

## What is Docker?

Docker is a containerization platform that packages your application with all its dependencies into a standardized unit (container). This ensures your application runs the same way everywhere.

## Installing Docker

### Windows
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Run the installer (WSL 2 recommended)
3. Restart your computer
4. Docker Desktop will auto-start

### macOS
1. Download Docker Desktop for Mac
2. Drag Docker.app to Applications
3. Open Applications > Docker
4. Grant permissions when prompted

### Linux (Ubuntu/Debian)
```bash
# Install Docker
sudo apt-get update
sudo apt-get install docker.io

# Install Docker Compose
sudo apt-get install docker-compose

# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker
```

## Verify Installation

```bash
docker --version
docker compose version
docker run hello-world
```

## Project Docker Files Explained

### Dockerfile
```dockerfile
FROM python:3.11-slim
# Base image: Python 3.11 lightweight version

WORKDIR /app
# Set working directory inside container

RUN apt-get update && \
    apt-get install -y curl gnupg unixodbc unixodbc-dev build-essential
# Install system dependencies needed for MSSQL connection

COPY requirements.txt .
# Copy Python dependencies file

RUN pip install --no-cache-dir -r requirements.txt
# Install Python packages

COPY . .
# Copy entire application code

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5001"]
# Command to run when container starts
```

### docker-compose.yml

```yaml
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    # Official SQL Server 2022 image
    
    container_name: sqlserver
    # Name of the container
    
    ports:
      - "1433:1433"
    # Map port 1433 from container to host
    
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: "Password@123"
    # Set SQL Server configuration
    
    volumes:
      - mssql_data:/var/opt/mssql
    # Persist database data even when container stops
    
    healthcheck:
      test: ["CMD", "/opt/mssql-tools18/bin/sqlcmd", "-S", "localhost", "-U", "sa", "-P", "Password@123"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 40s
    # Check if SQL Server is ready

  backend:
    build: .
    # Build image from Dockerfile in current directory
    
    container_name: backend
    # Name of the container
    
    ports:
      - "5001:5001"
    # Map port 5001
    
    environment:
      DATABASE_URL: mssql+pyodbc://...
    # Pass configuration to application
    
    depends_on:
      sqlserver:
        condition: service_healthy
    # Wait for SQL Server to be healthy before starting

volumes:
  mssql_data:
# Define named volume for database persistence

networks:
  book-network:
# Create custom network for service communication
```

## Common Docker Commands

### Starting Services
```bash
# Start services in background
docker compose up -d

# Start services and view logs
docker compose up

# Rebuild images before starting
docker compose up -d --build

# Start specific service
docker compose up -d sqlserver
```

### Viewing Status and Logs
```bash
# View all running containers
docker compose ps

# View all containers (including stopped)
docker compose ps -a

# View logs for all services
docker compose logs

# View logs for specific service
docker compose logs sqlserver

# Follow logs in real-time
docker compose logs -f

# View last 100 lines of logs
docker compose logs --tail=100
```

### Stopping Services
```bash
# Stop all services (containers remain)
docker compose stop

# Stop specific service
docker compose stop sqlserver

# Stop and remove containers
docker compose down

# Stop, remove containers, and delete volumes
docker compose down -v

# Stop and remove everything (images too)
docker compose down --rmi all
```

### Restarting Services
```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
```

### Executing Commands in Container
```bash
# Execute command in running container
docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd -U sa -P Password@123

# Get shell access to container
docker compose exec backend bash

# Run one-off command
docker compose run --rm backend python -c "import app; print(app.__version__)"
```

### Cleaning Up
```bash
# Remove stopped containers
docker container prune

# Remove unused volumes
docker volume prune

# Remove unused images
docker image prune

# Remove everything unused
docker system prune -a
```

## Troubleshooting Docker Issues

### Container Keeps Exiting

**Problem**: `Status: Exited (255)`

**Solutions**:
```bash
# Check detailed logs
docker compose logs sqlserver

# Increase allocated memory in Docker Desktop
# Preferences > Resources > Memory: Set to 4GB+

# Reset service
docker compose down -v
docker compose up -d
```

### Port Already in Use

**Problem**: `Error response from daemon: Ports are not available`

```bash
# Find what's using the port
# Linux/macOS:
lsof -i :1433
lsof -i :5001

# Windows:
netstat -ano | findstr :1433

# Kill the process
kill <PID>

# Or change port in docker-compose.yml:
ports:
  - "5432:1433"  # Use 5432 instead of 1433
```

### Docker Daemon Not Running

```bash
# Linux
sudo systemctl start docker

# Check if running
docker ps
```

### Permission Denied Errors

```bash
# Linux - add user to docker group
sudo usermod -aG docker $USER

# Apply changes
newgrp docker

# Verify
docker ps
```

### High Memory/CPU Usage

```bash
# View container resource usage
docker stats

# Limit memory in docker-compose.yml
services:
  sqlserver:
    ...
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

## Docker Best Practices

### Development
- Use environment variables for configuration
- Mount volumes for code to enable live reload
- Use health checks
- Don't run as root
- Keep images small

### Production
- Use specific image versions (not `latest`)
- Implement logging and monitoring
- Set resource limits
- Use health checks
- Run as non-root user
- Use secrets for sensitive data
- Enable automatic restart policies

### Example Production Compose
```yaml
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
    # ... other config

  backend:
    image: book-api:1.0.0  # Use specific version
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
    # ... other config
```

## Docker Network Communication

Containers in the same network can communicate using service names:

```yaml
# In docker-compose.yml
services:
  sqlserver:
    container_name: sqlserver
    networks:
      - book-network
  
  backend:
    networks:
      - book-network
    environment:
      # Use service name 'sqlserver' instead of localhost
      DATABASE_URL: mssql+pyodbc://sa:...@sqlserver:1433/...

networks:
  book-network:
```

## Docker Volume Management

### Types of Volumes

1. **Named Volumes** (Recommended)
```yaml
volumes:
  mssql_data:  # Docker manages location
```

2. **Bind Mounts** (For development)
```yaml
volumes:
  - ./data:/var/opt/mssql  # Local folder mapped to container
```

3. **Tmpfs Mount** (Temporary, in memory)
```yaml
tmpfs: /temp
```

### Volume Commands
```bash
# List all volumes
docker volume ls

# Inspect volume details
docker volume inspect book-network_mssql_data

# Remove unused volumes
docker volume prune

# Remove specific volume
docker volume rm book-network_mssql_data
```

## Building and Publishing Images

### Build Custom Image
```bash
# Build from Dockerfile
docker build -t book-api:1.0.0 .

# Build with build arguments
docker build -t book-api:1.0.0 --build-arg PYTHON_VERSION=3.11 .
```

### Publish to Registry
```bash
# Tag image
docker tag book-api:1.0.0 myregistry/book-api:1.0.0

# Push to registry
docker push myregistry/book-api:1.0.0

# Pull from registry
docker pull myregistry/book-api:1.0.0
```

## Docker Compose Overrides

Create `docker-compose.override.yml` for local development:

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.dev  # Use dev Dockerfile
    volumes:
      - .:/app  # Mount source code
    environment:
      - DEBUG=true
```

## Useful Docker Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
alias dc='docker compose'
alias dcup='docker compose up -d'
alias dcdn='docker compose down'
alias dclog='docker compose logs -f'
alias dcps='docker compose ps'
alias dcexec='docker compose exec'
```

## Further Learning

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Happy containerizing! 🐳**
