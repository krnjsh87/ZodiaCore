# ZodiaCore Development Setup Guide

## Overview

This guide provides comprehensive instructions for setting up a development environment for ZodiaCore. The platform consists of multiple services that need to be configured and running simultaneously.

## Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+)
- **Processor**: Intel Core i5 or equivalent (4+ cores recommended)
- **Memory**: 8GB RAM minimum, 16GB recommended
- **Storage**: 20GB free space for development environment
- **Network**: Stable internet connection for downloading dependencies

### Required Software

#### Core Development Tools
- **Node.js**: Version 20.x LTS ([Download](https://nodejs.org/))
- **Git**: Version 2.30+ ([Download](https://git-scm.com/))
- **Visual Studio Code**: Latest version ([Download](https://code.visualstudio.com/))

#### Containerization
- **Docker Desktop**: Version 24.0+ ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose**: Included with Docker Desktop

#### Database
- **MongoDB Atlas**: Free M0 tier account ([Sign up](https://www.mongodb.com/atlas))
- **Redis**: Local instance or cloud service (optional for development)

#### Additional Tools
- **Postman**: For API testing ([Download](https://www.postman.com/))
- **GitHub Desktop**: Optional GUI for Git ([Download](https://desktop.github.com/))

## Environment Setup

### Step 1: Install Node.js and npm

1. Download Node.js 20.x LTS from the official website
2. Run the installer and follow the setup wizard
3. Verify installation:
   ```bash
   node --version  # Should show v20.x.x
   npm --version   # Should show 10.x.x
   ```

### Step 2: Install Git

1. Download and install Git from git-scm.com
2. Configure Git with your information:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Step 3: Install Visual Studio Code

1. Download and install VS Code
2. Install recommended extensions:
   - ES7+ React/Redux/React-Native snippets
   - TypeScript Importer
   - Prettier - Code formatter
   - ESLint
   - Docker
   - MongoDB for VS Code

### Step 4: Install Docker Desktop

1. Download Docker Desktop for your operating system
2. Install and start Docker Desktop
3. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

### Step 5: Set up MongoDB Atlas

1. Create a free MongoDB Atlas account
2. Create a new project called "ZodiaCore"
3. Create a free M0 cluster
4. Set up database access:
   - Create a database user with read/write permissions
   - Add your IP address to the whitelist (or 0.0.0.0/0 for development)
5. Get your connection string from the "Connect" button

## Project Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/zodiacore.git
cd ZodiaCore

# Verify the clone
ls -la
```

### Step 2: Install Root Dependencies

```bash
# Install root-level dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Set up Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```bash
   # Database Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zodiacore?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d

   # Application Configuration
   NODE_ENV=development
   PORT=3000

   # Service URLs (for development)
   ZC1_SERVICE_URL=http://localhost:3001
   ZC2_SERVICE_URL=http://localhost:3002
   ZC3_SERVICE_URL=http://localhost:3003
   ZC4_SERVICE_URL=http://localhost:3004

   # Redis (optional for development)
   REDIS_URL=redis://localhost:6379

   # Email Configuration (optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### Step 4: Set up Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Return to root
cd ..
```

### Step 5: Set up Backend

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Return to root
cd ..
```

### Step 6: Set up Services

```bash
# Set up each service
cd services/zc1-vedic
npm install

cd ../zc2-chinese
npm install

cd ../zc3-western
npm install

cd ../zc4-numerology
npm install

# Return to root
cd ../..
```

## Running the Development Environment

### Option 1: Using Docker Compose (Recommended)

1. Start all services:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api/v1
   - Individual services: http://localhost:3001-3004

### Option 2: Manual Service Startup

1. Start MongoDB (if running locally):
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. Start Redis (optional):
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 --name redis redis:latest
   ```

3. Start individual services in separate terminals:

   **Terminal 1 - Backend Orchestrator:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - ZC1 Vedic Service:**
   ```bash
   cd services/zc1-vedic
   npm run dev
   ```

   **Terminal 3 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

   **Additional terminals for other services as needed**

## Development Workflow

### Code Changes

1. **Frontend Changes**:
   ```bash
   cd frontend
   # Make changes to React components
   npm run dev  # Hot reload enabled
   ```

2. **Backend Changes**:
   ```bash
   cd backend
   # Make changes to API logic
   npm run dev  # Auto-restart enabled
   ```

3. **Service Changes**:
   ```bash
   cd services/zc1-vedic
   # Make changes to calculation logic
   npm run dev
   ```

### Testing

1. **Run all tests**:
   ```bash
   npm test
   ```

2. **Run specific service tests**:
   ```bash
   cd services/zc1-vedic
   npm test
   ```

3. **Run frontend tests**:
   ```bash
   cd frontend
   npm test
   ```

### Code Quality

1. **Linting**:
   ```bash
   npm run lint
   ```

2. **Formatting**:
   ```bash
   npm run format
   ```

3. **Type checking**:
   ```bash
   npm run type-check
   ```

## Database Management

### Local MongoDB Setup

If you prefer local MongoDB instead of Atlas:

```bash
# Start MongoDB with Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# Connect to MongoDB shell
docker exec -it mongodb mongo
```

### Database Seeding

```bash
# Seed development data
npm run db:seed

# Reset database
npm run db:reset
```

### Database Migrations

```bash
# Create new migration
npm run migrate:create -- migration-name

# Run migrations
npm run migrate:up

# Rollback migration
npm run migrate:down
```

## API Testing

### Using Postman

1. Import the ZodiaCore API collection:
   - File → Import → Link
   - URL: `https://api.zodiacore.com/docs/collection.json`

2. Set up environment variables in Postman:
   - `base_url`: `http://localhost:3000`
   - `jwt_token`: Your authentication token

### Using cURL

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test API with authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/v1/user/profile
```

## Debugging

### Frontend Debugging

1. Open browser DevTools (F12)
2. Check Console for errors
3. Use React DevTools extension
4. Enable source maps in development

### Backend Debugging

1. Use VS Code debugger:
   - Open backend directory in VS Code
   - Go to Run & Debug panel
   - Select "Debug Backend" configuration
   - Set breakpoints and start debugging

2. Check logs:
   ```bash
   # View application logs
   docker-compose logs backend

   # View all service logs
   docker-compose logs
   ```

### Service Debugging

1. Check individual service logs:
   ```bash
   docker-compose logs zc1-vedic-service
   ```

2. Debug specific service:
   ```bash
   cd services/zc1-vedic
   npm run debug
   ```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using ports
netstat -ano | findstr :3000

# Kill process using port
taskkill /PID <PID> /F
```

#### Docker Issues
```bash
# Restart Docker Desktop
# Or rebuild containers
docker-compose down
docker-compose up --build --force-recreate
```

#### MongoDB Connection Issues
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

#### Node.js Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

### Performance Issues

1. **Slow builds**: Clear Docker cache and rebuild
2. **Memory issues**: Increase Docker memory allocation
3. **Database slow**: Check indexes and query optimization

## Advanced Setup

### Multiple Environments

1. **Development**: Local setup with hot reload
2. **Staging**: Docker Compose with production-like settings
3. **Testing**: Isolated environment for automated tests

### CI/CD Integration

1. **GitHub Actions**: Automated testing and deployment
2. **Docker Hub**: Container image registry
3. **Render**: Production hosting platform

### Monitoring Setup

1. **Prometheus**: Metrics collection
2. **Grafana**: Dashboard visualization
3. **ELK Stack**: Log aggregation and analysis

## Contributing

### Development Guidelines

1. Follow the established coding standards
2. Write comprehensive tests for new features
3. Update documentation for API changes
4. Use conventional commit messages
5. Create feature branches for development

### Code Review Process

1. Create a pull request
2. Ensure all tests pass
3. Request review from maintainers
4. Address review feedback
5. Merge after approval

## Support

### Documentation
- [API Documentation](../api/index.md)
- [Architecture Overview](../architecture.md)
- [Troubleshooting Guide](../troubleshooting.md)

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community questions and answers
- **Discord**: Real-time community support

### Professional Support
- **Email**: dev-support@zodiacore.com
- **Priority Support**: Available for enterprise customers

## Next Steps

After completing the setup:

1. **Explore the codebase**: Familiarize yourself with the project structure
2. **Run the test suite**: Ensure everything is working correctly
3. **Create your first feature**: Start with a small feature or bug fix
4. **Join the community**: Participate in discussions and contribute back

Happy coding with ZodiaCore! 🚀