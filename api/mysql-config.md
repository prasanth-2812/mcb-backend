# MySQL Database Configuration

## Environment Variables

Create a `.env` file in the `api` directory with the following configuration:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=2812
DB_NAME=mcb_job_app

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Setup Instructions

1. **Install MySQL Server** (if not already installed)
2. **Start MySQL Service**
3. **Create the database**:
   ```bash
   cd api
   npm run init-mysql
   ```
4. **Start the application**:
   ```bash
   npm run dev:mysql
   ```

## Database Schema

The application will automatically create the following tables:
- users
- jobs
- applications
- notifications
- saved_jobs
- companies
- skills
- job_skills
- user_skills

## Connection Details

- **Host**: localhost
- **Port**: 3306
- **Username**: root
- **Password**: 2812
- **Database**: mcb_job_app

