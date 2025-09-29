# Job Application App API Documentation

## Overview

This document provides comprehensive API documentation for the Job Application mobile app backend services. The API follows RESTful principles and uses JWT authentication.

**Base URL:** `https://api.jobapp.com/v1`  
**Authentication:** Bearer Token (JWT)  
**Content-Type:** `application/json`

---

## Table of Contents

- [Authentication](#authentication)
- [Jobs](#jobs)
- [Applications](#applications)
- [Saved Jobs](#saved-jobs)
- [Notifications](#notifications)
- [Profile](#profile)
- [Dashboard](#dashboard)
- [Search & Filters](#search--filters)
- [File Upload](#file-upload)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

### POST /auth/login

Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+91 9876543210",
      "location": "Hyderabad, India",
      "skills": ["React Native", "SQL", "AWS"],
      "profileCompletion": 60,
      "preferences": {
        "role": "Software Developer",
        "location": "Bangalore",
        "type": "Full-time"
      }
    }
  }
}
```

**Error Responses:**
- `400` - Invalid credentials
- `401` - Unauthorized
- `500` - Internal server error

---

### POST /auth/register

Register new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "+91 9876543210",
  "location": "Hyderabad, India"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+91 9876543210",
      "location": "Hyderabad, India",
      "profileCompletion": 20,
      "preferences": {
        "role": "",
        "location": "",
        "type": ""
      }
    }
  }
}
```

**Error Responses:**
- `400` - Validation error
- `409` - Email already exists
- `500` - Internal server error

---

### POST /auth/logout

Logout user and invalidate token.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /auth/refresh

Refresh JWT token.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/forgot-password

Send password reset email to user.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully",
  "data": {
    "resetToken": "abc123def456",
    "expiresIn": 3600
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Email not found
- `429` - Too many requests

### POST /auth/reset-password

Reset user password using reset token.

**Request Body:**
```json
{
  "token": "abc123def456",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid or expired token
- `422` - Validation error

---

## Jobs

### GET /jobs

Get paginated list of jobs with filtering and search.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 20)
- `search` (string, optional) - Search query
- `jobType` (string[], optional) - Filter by job types
- `location` (string[], optional) - Filter by locations
- `salaryMin` (number, optional) - Minimum salary
- `salaryMax` (number, optional) - Maximum salary
- `experience` (string[], optional) - Filter by experience levels
- `isRemote` (boolean, optional) - Filter remote jobs
- `isUrgent` (boolean, optional) - Filter urgent jobs
- `sortBy` (string, optional) - Sort by: 'relevance', 'date', 'salary'
- `sortOrder` (string, optional) - Sort order: 'asc', 'desc'

**Example Request:**
```
GET /jobs?page=1&limit=20&search=react&jobType=Full-time&location=Bangalore&salaryMin=50000&salaryMax=150000&isRemote=true&sortBy=relevance&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "1",
        "title": "Senior React Native Developer",
        "company": "TechCorp Inc.",
        "location": "San Francisco, CA",
        "type": "Full-time",
        "salary": "$120,000 - $150,000",
        "experience": "5+ years",
        "description": "We are looking for a Senior React Native Developer...",
        "requirements": [
          "5+ years of React Native experience",
          "Strong JavaScript/TypeScript skills",
          "Experience with Redux/Context API"
        ],
        "benefits": [
          "Health insurance",
          "401k matching",
          "Flexible work hours"
        ],
        "postedDate": "2024-01-15",
        "deadline": "2024-02-15",
        "isRemote": true,
        "isUrgent": false,
        "companyLogo": "https://img.icons8.com/color/60/000000/tech-corp.png",
        "tags": ["React Native", "JavaScript", "Mobile", "Remote"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalJobs": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### GET /jobs/{jobId}

Get detailed information about a specific job.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**
- `jobId` (string, required) - Job ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Senior React Native Developer",
    "company": "TechCorp Inc.",
    "location": "San Francisco, CA",
    "type": "Full-time",
    "salary": "$120,000 - $150,000",
    "experience": "5+ years",
    "description": "We are looking for a Senior React Native Developer to join our mobile team...",
    "requirements": [
      "5+ years of React Native experience",
      "Strong JavaScript/TypeScript skills",
      "Experience with Redux/Context API",
      "Knowledge of native iOS/Android development",
      "Experience with testing frameworks"
    ],
    "benefits": [
      "Health insurance",
      "401k matching",
      "Flexible work hours",
      "Remote work options",
      "Professional development budget"
    ],
    "postedDate": "2024-01-15",
    "deadline": "2024-02-15",
    "isRemote": true,
    "isUrgent": false,
    "companyLogo": "https://img.icons8.com/color/60/000000/tech-corp.png",
    "tags": ["React Native", "JavaScript", "Mobile", "Remote"],
    "companyInfo": {
      "name": "TechCorp Inc.",
      "description": "Leading technology company focused on innovation...",
      "website": "https://techcorp.com",
      "size": "1000+ employees",
      "industry": "Technology"
    }
  }
}
```

**Error Responses:**
- `404` - Job not found
- `401` - Unauthorized
- `500` - Internal server error

---

### GET /jobs/recommended

Get personalized job recommendations based on user profile.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `limit` (number, optional) - Number of recommendations (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "1",
        "title": "Senior React Native Developer",
        "company": "TechCorp Inc.",
        "location": "San Francisco, CA",
        "type": "Full-time",
        "salary": "$120,000 - $150,000",
        "matchPercentage": 85,
        "reason": "Matches your React Native and JavaScript skills"
      }
    ]
  }
}
```

---

### GET /jobs/search

Search jobs with advanced filters.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `q` (string, required) - Search query
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page
- `filters` (object, optional) - Advanced filters

**Example Request:**
```
GET /jobs/search?q=react developer&filters={"jobType":["Full-time"],"location":["Bangalore"]}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [],
    "pagination": {},
    "searchMetadata": {
      "query": "react developer",
      "totalResults": 25,
      "searchTime": "0.045s"
    }
  }
}
```

---

## Applications

### GET /applications

Get user's job applications with filtering.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `status` (string, optional) - Filter by status: 'applied', 'shortlisted', 'interview', 'rejected', 'accepted'
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page

**Example Request:**
```
GET /applications?status=applied&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "1",
        "jobId": "1",
        "jobTitle": "Senior React Native Developer",
        "company": "TechCorp Inc.",
        "appliedDate": "2024-01-16",
        "status": "applied",
        "statusHistory": [
          {
            "status": "applied",
            "date": "2024-01-16",
            "description": "Application submitted successfully"
          }
        ],
        "nextStep": "Application under review",
        "interviewDate": null,
        "notes": "Applied through company website",
        "salary": "$120,000 - $150,000",
        "location": "San Francisco, CA"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalApplications": 15
    }
  }
}
```

---

### GET /applications/{applicationId}

Get detailed information about a specific application.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**
- `applicationId` (string, required) - Application ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "jobId": "1",
    "jobTitle": "Senior React Native Developer",
    "company": "TechCorp Inc.",
    "appliedDate": "2024-01-16",
    "status": "shortlisted",
    "statusHistory": [
      {
        "status": "applied",
        "date": "2024-01-16",
        "description": "Application submitted"
      },
      {
        "status": "shortlisted",
        "date": "2024-01-25",
        "description": "Application reviewed and shortlisted for interview"
      }
    ],
    "nextStep": "Technical interview scheduled",
    "interviewDate": "2024-02-05",
    "notes": "Strong portfolio match",
    "salary": "$120,000 - $150,000",
    "location": "San Francisco, CA",
    "applicationData": {
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+91 9876543210",
      "resume": "https://api.jobapp.com/resumes/john_doe_resume.pdf",
      "coverLetter": "I am excited to apply for the Senior React Native Developer position..."
    }
  }
}
```

---

### POST /applications

Submit a new job application.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "jobId": "1",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+91 9876543210",
  "resume": "https://api.jobapp.com/resumes/john_doe_resume.pdf",
  "coverLetter": "I am excited to apply for the Senior React Native Developer position..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "jobId": "1",
    "status": "applied",
    "appliedDate": "2024-01-16",
    "message": "Application submitted successfully"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `409` - Already applied to this job
- `500` - Internal server error

---

### PATCH /applications/{applicationId}/status

Update application status (for admin/recruiter use).

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**
- `applicationId` (string, required) - Application ID

**Request Body:**
```json
{
  "status": "shortlisted",
  "notes": "Strong technical background",
  "interviewDate": "2024-02-05T14:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": "shortlisted",
    "updatedAt": "2024-01-25T10:30:00Z"
  }
}
```

---

## Saved Jobs

### GET /saved-jobs

Get user's saved jobs.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "savedJobs": [
      {
        "id": "1",
        "jobId": "1",
        "savedAt": "2024-01-16T10:30:00Z",
        "job": {
          "id": "1",
          "title": "Senior React Native Developer",
          "company": "TechCorp Inc.",
          "location": "San Francisco, CA",
          "type": "Full-time",
          "salary": "$120,000 - $150,000",
          "postedDate": "2024-01-15"
        }
      }
    ]
  }
}
```

---

### POST /saved-jobs

Save a job to user's saved list.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "jobId": "1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Job saved successfully"
  }
}
```

**Error Responses:**
- `409` - Job already saved
- `404` - Job not found

---

### DELETE /saved-jobs/{jobId}

Remove a job from user's saved list.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**
- `jobId` (string, required) - Job ID

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Job removed from saved list"
  }
}
```

---

## Notifications

### GET /notifications

Get user's notifications with pagination.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number, optional) - Page number
- `limit` (number, optional) - Items per page
- `type` (string, optional) - Filter by notification type
- `isRead` (boolean, optional) - Filter by read status

**Example Request:**
```
GET /notifications?page=1&limit=20&isRead=false
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "1",
        "title": "Interview Scheduled",
        "message": "Your interview for Frontend Developer at StartupXYZ has been scheduled for February 5th at 2:00 PM.",
        "type": "interview",
        "priority": "high",
        "isRead": false,
        "timestamp": "2024-02-01T10:30:00Z",
        "actionUrl": "/applications/2"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalNotifications": 15
    },
    "unreadCount": 5
  }
}
```

---

### PATCH /notifications/{notificationId}/read

Mark a notification as read.

**Headers:** `Authorization: Bearer {token}`

**Path Parameters:**
- `notificationId` (string, required) - Notification ID

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Notification marked as read"
  }
}
```

---

### PATCH /notifications/mark-all-read

Mark all notifications as read.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "All notifications marked as read"
  }
}
```

---

## Profile

### GET /profile

Get user's profile information.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+91 9876543210",
    "location": "Hyderabad, India",
    "skills": ["React Native", "SQL", "AWS"],
    "resume": {
      "fileName": "John_Doe_Resume.pdf",
      "uploaded": true,
      "url": "https://api.jobapp.com/resumes/john_doe_resume.pdf"
    },
    "profilePicture": {
      "uri": "https://api.jobapp.com/profile-pictures/john_doe.jpg",
      "uploaded": true
    },
    "profileCompletion": 60,
    "preferences": {
      "role": "Software Developer",
      "location": "Bangalore",
      "type": "Full-time"
    },
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Passionate React Native developer with 5+ years of experience",
      "website": "https://johndoe.dev",
      "linkedin": "https://linkedin.com/in/johndoe",
      "github": "https://github.com/johndoe"
    },
    "professionalInfo": {
      "title": "Senior React Native Developer",
      "experience": "5+ years",
      "availability": "Immediate",
      "expectedSalary": "$120,000 - $150,000",
      "workType": ["Full-time", "Remote"],
      "skills": ["React Native", "JavaScript", "TypeScript", "Redux"],
      "languages": [
        {
          "language": "English",
          "proficiency": "Fluent"
        }
      ]
    },
    "education": [
      {
        "id": "1",
        "degree": "Bachelor of Technology",
        "field": "Computer Science",
        "institution": "University of Technology",
        "startDate": "2015-09-01",
        "endDate": "2019-06-30",
        "gpa": "3.8",
        "description": "Focused on software engineering and mobile development"
      }
    ],
    "experience": [
      {
        "id": "1",
        "title": "Senior React Native Developer",
        "company": "TechCorp Inc.",
        "location": "San Francisco, CA",
        "startDate": "2021-01-01",
        "endDate": null,
        "isCurrent": true,
        "description": "Led development of mobile applications using React Native",
        "achievements": [
          "Improved app performance by 40%",
          "Led a team of 5 developers"
        ]
      }
    ],
    "projects": [
      {
        "id": "1",
        "name": "E-commerce Mobile App",
        "description": "Built a full-featured e-commerce mobile app using React Native",
        "technologies": ["React Native", "Redux", "Firebase"],
        "url": "https://github.com/johndoe/ecommerce-app",
        "startDate": "2023-01-01",
        "endDate": "2023-06-30"
      }
    ],
    "certifications": [
      {
        "id": "1",
        "name": "AWS Certified Developer",
        "issuer": "Amazon Web Services",
        "issueDate": "2023-03-15",
        "expiryDate": "2026-03-15",
        "credentialId": "AWS-DEV-123456"
      }
    ]
  }
}
```

---

### PUT /profile

Update user's profile information.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91 9876543210",
  "location": "Bangalore, India",
  "skills": ["React Native", "JavaScript", "TypeScript", "Redux", "AWS"],
  "preferences": {
    "role": "Senior Software Developer",
    "location": "Bangalore",
    "type": "Full-time"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully",
    "profileCompletion": 75
  }
}
```

---

### POST /profile/resume

Upload user's resume file.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```
Content-Type: multipart/form-data

resume: file (required, PDF format)
fileName: string (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "John_Doe_Resume.pdf",
    "url": "https://api.jobapp.com/resumes/john_doe_resume.pdf",
    "uploaded": true
  }
}
```

---

### POST /profile/picture

Upload user's profile picture.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```
Content-Type: multipart/form-data

picture: file (required, image format)
fileName: string (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uri": "https://api.jobapp.com/profile-pictures/john_doe.jpg",
    "uploaded": true
  }
}
```

---

### DELETE /profile/picture

Delete user's profile picture.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Profile picture deleted successfully"
  }
}
```

---

## Dashboard

### GET /dashboard

Get home dashboard data including stats and recommendations.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "John Doe",
      "profileCompletion": 60
    },
    "stats": {
      "totalApplications": 15,
      "shortlistedApplications": 3,
      "interviewScheduled": 2,
      "savedJobs": 8
    },
    "recommendedJobs": [
      {
        "id": "1",
        "title": "Senior React Native Developer",
        "company": "TechCorp Inc.",
        "location": "San Francisco, CA",
        "type": "Full-time",
        "salary": "$120,000 - $150,000",
        "matchPercentage": 85,
        "reason": "Matches your React Native and JavaScript skills"
      }
    ],
    "recentApplications": [
      {
        "id": "1",
        "jobTitle": "Senior React Native Developer",
        "company": "TechCorp Inc.",
        "status": "applied",
        "appliedDate": "2024-01-16"
      }
    ],
    "notifications": {
      "unreadCount": 5,
      "urgentCount": 1
    },
    "insights": {
      "highMatchJobs": 3,
      "urgentPositions": 1,
      "availableLocations": 5
    }
  }
}
```

---

## Search & Filters

### GET /jobs/filters

Get available filter options for jobs.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "jobTypes": ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
    "experienceLevels": ["Fresher", "1-3 yrs", "3-5 yrs", "5+ yrs"],
    "locations": ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"],
    "salaryRanges": [
      {"min": 0, "max": 50000, "label": "₹0 - ₹50k"},
      {"min": 50000, "max": 100000, "label": "₹50k - ₹100k"},
      {"min": 100000, "max": 200000, "label": "₹100k - ₹200k"},
      {"min": 200000, "max": 500000, "label": "₹200k+"}
    ],
    "companySizes": ["Startup", "Small (1-50)", "Medium (51-200)", "Large (201-1000)", "Enterprise (1000+)"],
    "industries": ["Technology", "Finance", "Healthcare", "E-commerce", "Education", "Manufacturing"]
  }
}
```

---

### GET /jobs/suggestions

Get search suggestions based on query.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `q` (string, required) - Search query
- `limit` (number, optional) - Number of suggestions (default: 10)

**Example Request:**
```
GET /jobs/suggestions?q=react&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "React Native Developer",
      "React.js Developer",
      "React Developer",
      "Senior React Developer"
    ],
    "popularSearches": [
      "Software Engineer",
      "Frontend Developer",
      "Full Stack Developer"
    ]
  }
}
```

---

## File Upload

### POST /upload

Upload files (resume, profile picture, etc.).

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```
Content-Type: multipart/form-data

file: file (required)
type: string (required: 'resume', 'profile-picture')
fileName: string (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://api.jobapp.com/uploads/john_doe_resume.pdf",
    "fileName": "john_doe_resume.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf"
  }
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHORIZED | Invalid or missing authentication |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 422 | UNPROCESSABLE_ENTITY | Invalid request data |
| 500 | INTERNAL_ERROR | Server error |

### Validation Error Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Email is required"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

---

## Rate Limiting

### Limits

- **Authenticated users:** 1000 requests per hour
- **Unauthenticated users:** 100 requests per hour

### Rate Limit Headers

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Request limit per hour |
| `X-RateLimit-Remaining` | Remaining requests in current hour |
| `X-RateLimit-Reset` | Time when rate limit resets (Unix timestamp) |

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again later.",
    "retryAfter": 3600
  }
}
```

---

## Pagination

### Query Parameters

- `page` - Page number (starts from 1)
- `limit` - Number of items per page (max 100)

### Pagination Response Format

```json
{
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Frontend Implementation Notes

### Authentication
- Store JWT token securely using AsyncStorage
- Include token in Authorization header for all protected requests
- Handle token expiration and refresh automatically
- Implement logout functionality to clear stored tokens

### Error Handling
- Implement proper error handling for all API calls
- Show user-friendly error messages
- Handle network connectivity issues
- Implement retry logic for failed requests

### Caching
- Cache job listings and user profile data
- Implement cache invalidation strategies
- Use optimistic updates for better UX
- Store frequently accessed data locally

### File Upload
- Implement file picker for resume and profile picture uploads
- Validate file types and sizes before upload
- Show upload progress indicators
- Handle upload failures gracefully

### Real-time Updates
- Consider implementing WebSocket for real-time notifications
- Use polling for application status updates
- Implement push notifications for important updates

### Offline Support
- Cache essential data for offline viewing
- Implement sync when connection is restored
- Show offline indicators in the UI
- Queue actions for when connection is available

---

## Support

For API support and questions, please contact:
- **Email:** api-support@jobapp.com
- **Documentation:** https://docs.jobapp.com
- **Status Page:** https://status.jobapp.com
