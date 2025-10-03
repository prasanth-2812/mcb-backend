import AsyncStorage from '@react-native-async-storage/async-storage';
import { applicationsService } from './applicationsService';

export interface JobApplicationResponse {
  message: string;
  jobId: string;
  userId: string;
  appliedAt: string;
}

class JobApplicationService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Apply to a job using the applications service
  async applyToJob(jobId: string, coverLetter?: string, resumeUrl?: string): Promise<JobApplicationResponse> {
    try {
      console.log(`🔄 Applying to job: ${jobId}`);
      
      const response = await applicationsService.applyToJob({
        jobId,
        coverLetter,
        resumeUrl,
      });
      
      console.log('✅ Job application successful:', response);
      
      // Transform response to match expected interface
      return {
        message: 'Application submitted successfully',
        jobId: response.jobId,
        userId: response.userId,
        appliedAt: response.appliedAt,
      };
    } catch (error) {
      console.error('❌ Job application failed:', error);
      throw error;
    }
  }

  // Save pending job application for after login
  async savePendingApplication(jobId: string): Promise<void> {
    try {
      await AsyncStorage.setItem('pendingJobApplication', jobId);
      console.log(`💾 Saved pending job application: ${jobId}`);
    } catch (error) {
      console.error('❌ Failed to save pending application:', error);
    }
  }

  // Get and clear pending job application
  async getPendingApplication(): Promise<string | null> {
    try {
      const jobId = await AsyncStorage.getItem('pendingJobApplication');
      if (jobId) {
        await AsyncStorage.removeItem('pendingJobApplication');
        console.log(`📤 Retrieved pending job application: ${jobId}`);
      }
      return jobId;
    } catch (error) {
      console.error('❌ Failed to get pending application:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      return !!token;
    } catch (error) {
      console.error('❌ Failed to check authentication:', error);
      return false;
    }
  }

  // Get user's applications
  async getUserApplications(): Promise<any[]> {
    try {
      return await applicationsService.getApplications();
    } catch (error) {
      console.error('❌ Failed to get applications:', error);
      throw error;
    }
  }

  // Check if user has applied to a job
  async hasAppliedToJob(jobId: string): Promise<boolean> {
    try {
      return await applicationsService.hasAppliedToJob(jobId);
    } catch (error) {
      console.error('❌ Failed to check application status:', error);
      return false;
    }
  }

  // Withdraw application
  async withdrawApplication(applicationId: string): Promise<boolean> {
    try {
      const result = await applicationsService.withdrawApplication(applicationId);
      return result.deleted;
    } catch (error) {
      console.error('❌ Failed to withdraw application:', error);
      throw error;
    }
  }
}

export const jobApplicationService = new JobApplicationService();
export default jobApplicationService;
