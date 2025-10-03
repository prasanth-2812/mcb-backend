export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  isRemote: boolean;
  isUrgent: boolean;
  companyLogo: string;
  tags: string[];
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: ApplicationStatus;
  statusHistory: StatusHistory[];
  notes: string;
  interviewDate: string | null;
  salary: string;
  location: string;
  nextStep?: string;
}

export type ApplicationStatus = 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'accepted';

export interface StatusHistory {
  status: ApplicationStatus;
  date: string;
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  timestamp: string;
  priority: NotificationPriority;
  actionUrl: string;
}

export type NotificationType = 
  | 'application_update' 
  | 'application'
  | 'interview' 
  | 'job_match' 
  | 'application_rejected' 
  | 'profile_reminder' 
  | 'profile'
  | 'recommendation'
  | 'deadline'
  | 'rejection'
  | 'company'
  | 'assessment'
  | 'tip'
  | 'digest'
  | 'weekly_digest';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  resume: {
    fileName: string;
    uploaded: boolean;
  };
  profilePicture: {
    uri: string;
    uploaded: boolean;
  };
  profileCompletion: number;
  preferences: {
    role: string;
    location: string;
    type: string;
  };
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  bio: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ProfessionalInfo {
  title: string;
  experience: string;
  availability: string;
  expectedSalary: string;
  workType: string[];
  skills: string[];
  languages: Language[];
}

export interface Language {
  language: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Fluent' | 'Native';
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId?: string;
}

export interface Resume {
  fileName: string;
  uploaded: boolean;
}

export interface Preferences {
  jobTypes: string[];
  workArrangement: string[];
  industries: string[];
  companySize: string[];
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  jobMatches: boolean;
  applicationUpdates: boolean;
  weeklyDigest: boolean;
}

export interface AppState {
  user: UserProfile | null;
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  savedJobs: string[];
  appliedJobs: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  currentScreen: 'onboarding' | 'login' | 'signup' | 'forgot-password' | 'main';
  onboardingComplete: boolean;
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { email: string; password: string; name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  applyToJob: (jobId: string) => void;
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleTheme: () => void;
  navigateToScreen: (screen: 'onboarding' | 'login' | 'signup' | 'forgot-password' | 'main') => void;
  setOnboardingComplete: (complete: boolean) => void;
}

export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: UserProfile | null }
  | { type: 'SET_JOBS'; payload: Job[] }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_APPLICATION'; payload: Application }
  | { type: 'SAVE_JOB'; payload: string }
  | { type: 'UNSAVE_JOB'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_CURRENT_SCREEN'; payload: 'onboarding' | 'login' | 'signup' | 'forgot-password' | 'main' }
  | { type: 'SET_ONBOARDING_COMPLETE'; payload: boolean };

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface FilterOptions {
  jobType: string[];
  location: string[];
  salaryRange: [number, number];
  experience: string[];
  remote: boolean | null;
  companySize: string[];
}

export interface SearchFilters {
  query: string;
  filters: FilterOptions;
  sortBy: 'relevance' | 'date' | 'salary';
  sortOrder: 'asc' | 'desc';
}
