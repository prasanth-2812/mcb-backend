import { ApiJob, ApiUser, ApiCandidate } from '../services/api';
import { Job, UserProfile } from '../types';

// Transform API job to app job format
export const transformApiJobToJob = (apiJob: ApiJob): Job => {
  return {
    id: apiJob.id,
    title: apiJob.title,
    company: apiJob.company,
    location: apiJob.location || 'Not specified',
    type: apiJob.type || 'Full-time',
    salary: '$50,000 - $80,000', // Default salary since API doesn't have salary field
    experience: '2-5 years', // Default experience
    description: apiJob.description || 'No description available',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Strong problem-solving skills',
      'Team player with good communication skills'
    ],
    tags: [
      apiJob.category || 'Technology',
      apiJob.type || 'Full-time',
      apiJob.isRemote ? 'Remote' : 'On-site'
    ],
    postedDate: new Date(apiJob.createdAt).toISOString().split('T')[0],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    companyLogo: `https://via.placeholder.com/50x50/2563eb/ffffff?text=${apiJob.company.charAt(0)}`,
    isRemote: apiJob.isRemote || false,
    isUrgent: false,
    isSaved: false,
    matchPercentage: Math.floor(Math.random() * 40) + 60, // Random match percentage between 60-100
  };
};

// Transform API user to app user format
export const transformApiUserToUser = (apiUser: ApiUser): UserProfile => {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone || '',
    profilePicture: `https://via.placeholder.com/100x100/2563eb/ffffff?text=${apiUser.name.charAt(0)}`,
    title: apiUser.role === 'employer' ? 'HR Manager' : 'Software Developer',
    location: 'San Francisco, CA',
    experience: '3+ years',
    education: 'Bachelor\'s Degree',
    skills: ['React', 'JavaScript', 'Node.js', 'TypeScript'],
    bio: `Experienced ${apiUser.role} with a passion for technology and innovation.`,
    resume: null,
    appliedJobs: [],
    savedJobs: [],
    notifications: [],
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
  };
};

// Transform multiple API jobs to app jobs
export const transformApiJobsToJobs = (apiJobs: ApiJob[]): Job[] => {
  return apiJobs.map(transformApiJobToJob);
};

// Transform multiple API users to app users
export const transformApiUsersToUsers = (apiUsers: ApiUser[]): UserProfile[] => {
  return apiUsers.map(transformApiUserToUser);
};
