import profileData from '../data/profile.json';

export const loadInitialData = () => {
  return {
    user: profileData,
    jobs: [],
    applications: [],
    notifications: [],
    savedJobs: [],
    appliedJobs: [],
  };
};
