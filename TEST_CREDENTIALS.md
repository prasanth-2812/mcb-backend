# Test User Credentials

This document contains the default test user credentials for authentication testing in development.

## Important Notes

- All seed users are created with the default password: `password123`
- Seed data is automatically loaded in non-production environments
- These credentials work after running the seed script

## Test Users

### Employee Test Users

#### John Doe
- **Email:** `john.doe@example.com`
- **Password:** `password123`
- **Role:** Employee
- **Skills:** React, JavaScript, Node.js, MongoDB
- **Experience:** 3 years

#### Jane Smith
- **Email:** `jane.smith@example.com`
- **Password:** `password123`
- **Role:** Employee
- **Skills:** Python, Django, PostgreSQL, AWS
- **Experience:** 5 years

### Employer Test Users

#### Sarah Johnson (TechCorp Solutions)
- **Email:** `hr@techcorp.com`
- **Password:** `password123`
- **Role:** Employer
- **Company:** TechCorp Solutions

#### Mike Wilson (InnovateTech)
- **Email:** `recruiter@innovate.com`
- **Password:** `password123`
- **Role:** Employer
- **Company:** InnovateTech

## Using Test Credentials

### Login Example (API)

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Login Example (Frontend)

```javascript
// Use any of the test user emails with password123
const response = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john.doe@example.com',
    password: 'password123'
  })
});
```

## Creating Custom Test Users

If you need custom test users, you can register them via the API:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "yourpassword",
    "name": "Test User",
    "role": "employee"
  }'
```

## Environment Variables

The `.env.test` file contains the following test-related configuration:

```env
TEST_PASSWORD=password123
JWT_EXPIRES_IN=1h  # Short expiration for testing
```

For development, the `.env` file uses:

```env
JWT_EXPIRES_IN=30d  # Extended expiration for convenience
```

