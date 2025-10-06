// Real Job Data Service - Integration with external job APIs
import { Job } from '../types';

export interface JobAPIResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
  page?: number;
  limit?: number;
}

class RealJobDataService {
  private readonly API_KEYS = {
    // These would be your actual API keys
    INDEED: process.env.INDEED_API_KEY || 'your_indeed_api_key',
    LINKEDIN: process.env.LINKEDIN_API_KEY || 'your_linkedin_api_key',
    GLASSDOOR: process.env.GLASSDOOR_API_KEY || 'your_glassdoor_api_key',
    ADZUNA: process.env.ADZUNA_API_KEY || 'your_adzuna_api_key',
  };

  private readonly API_ENDPOINTS = {
    INDEED: 'https://indeed-indeed.p.rapidapi.com/apisearch',
    LINKEDIN: 'https://api.linkedin.com/v2/jobs',
    GLASSDOOR: 'https://api.glassdoor.com/api/api.htm',
    ADZUNA: 'https://api.adzuna.com/v1/api/jobs',
    REMOTE_OK: 'https://remoteok.io/api',
    GITHUB_JOBS: 'https://jobs.github.com/positions.json',
  };

  // Indeed Jobs API Integration
  async searchIndeedJobs(params: JobSearchParams): Promise<Job[]> {
    try {
      console.log('🔍 Searching Indeed jobs with params:', params);
      
      const searchParams = new URLSearchParams({
        publisher: this.API_KEYS.INDEED,
        v: '2',
        format: 'json',
        q: params.query || '',
        l: params.location || '',
        sort: 'date',
        radius: '25',
        start: ((params.page || 0) * (params.limit || 10)).toString(),
        limit: (params.limit || 10).toString(),
        fromage: '30',
        highlight: '1',
        filter: '1',
        latlong: '1',
        co: 'us',
        chnl: '',
        userip: '1.2.3.4',
        useragent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });

      const response = await fetch(`${this.API_ENDPOINTS.INDEED}?${searchParams}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.API_KEYS.INDEED,
          'X-RapidAPI-Host': 'indeed-indeed.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`Indeed API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformIndeedJobs(data.results || []);
    } catch (error) {
      console.error('❌ Indeed API error:', error);
      return [];
    }
  }

  // LinkedIn Jobs API Integration
  async searchLinkedInJobs(params: JobSearchParams): Promise<Job[]> {
    try {
      console.log('🔍 Searching LinkedIn jobs with params:', params);
      
      const searchParams = new URLSearchParams({
        keywords: params.query || '',
        locationName: params.location || '',
        start: ((params.page || 0) * (params.limit || 10)).toString(),
        count: (params.limit || 10).toString(),
        sortBy: 'DD', // Date descending
      });

      const response = await fetch(`${this.API_ENDPOINTS.LINKEDIN}?${searchParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.API_KEYS.LINKEDIN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformLinkedInJobs(data.elements || []);
    } catch (error) {
      console.error('❌ LinkedIn API error:', error);
      return [];
    }
  }

  // RemoteOK API Integration
  async searchRemoteJobs(params: JobSearchParams): Promise<Job[]> {
    try {
      console.log('🔍 Searching RemoteOK jobs with params:', params);
      
      const response = await fetch(this.API_ENDPOINTS.REMOTE_OK, {
        method: 'GET',
        headers: {
          'User-Agent': 'MCB-App/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`RemoteOK API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformRemoteOKJobs(data.slice(1) || []); // Remove first element (metadata)
    } catch (error) {
      console.error('❌ RemoteOK API error:', error);
      return [];
    }
  }

  // GitHub Jobs API Integration
  async searchGitHubJobs(params: JobSearchParams): Promise<Job[]> {
    try {
      console.log('🔍 Searching GitHub jobs with params:', params);
      
      const searchParams = new URLSearchParams({
        description: params.query || '',
        location: params.location || '',
        full_time: params.jobType === 'full-time' ? 'true' : 'false',
        page: (params.page || 0).toString()
      });

      const response = await fetch(`${this.API_ENDPOINTS.GITHUB_JOBS}?${searchParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub Jobs API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformGitHubJobs(data || []);
    } catch (error) {
      console.error('❌ GitHub Jobs API error:', error);
      return [];
    }
  }

  // Adzuna Jobs API Integration
  async searchAdzunaJobs(params: JobSearchParams): Promise<Job[]> {
    try {
      console.log('🔍 Searching Adzuna jobs with params:', params);
      
      const searchParams = new URLSearchParams({
        app_id: this.API_KEYS.ADZUNA.split('_')[0],
        app_key: this.API_KEYS.ADZUNA.split('_')[1],
        what: params.query || '',
        where: params.location || '',
        results_per_page: (params.limit || 10).toString(),
        page: (params.page || 0).toString(),
        content_type: 'json'
      });

      const response = await fetch(`${this.API_ENDPOINTS.ADZUNA}/us/search/1?${searchParams}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Adzuna API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformAdzunaJobs(data.results || []);
    } catch (error) {
      console.error('❌ Adzuna API error:', error);
      return [];
    }
  }

  // Combined search across multiple APIs
  async searchAllJobs(params: JobSearchParams): Promise<JobAPIResponse> {
    try {
      console.log('🔍 Searching all job sources with params:', params);
      
      const [indeedJobs, linkedinJobs, remoteJobs, githubJobs, adzunaJobs] = await Promise.allSettled([
        this.searchIndeedJobs(params),
        this.searchLinkedInJobs(params),
        this.searchRemoteJobs(params),
        this.searchGitHubJobs(params),
        this.searchAdzunaJobs(params)
      ]);

      const allJobs: Job[] = [];
      
      // Combine results from all sources
      [indeedJobs, linkedinJobs, remoteJobs, githubJobs, adzunaJobs].forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allJobs.push(...result.value);
        } else {
          console.warn(`Job source ${index} failed:`, result.reason);
        }
      });

      // Remove duplicates based on job title and company
      const uniqueJobs = this.removeDuplicateJobs(allJobs);
      
      // Sort by date (newest first)
      const sortedJobs = uniqueJobs.sort((a, b) => 
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );

      const page = params.page || 0;
      const limit = params.limit || 20;
      const startIndex = page * limit;
      const endIndex = startIndex + limit;
      const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

      return {
        jobs: paginatedJobs,
        total: uniqueJobs.length,
        page,
        limit,
        hasMore: endIndex < uniqueJobs.length
      };
    } catch (error) {
      console.error('❌ Combined job search failed:', error);
      return {
        jobs: [],
        total: 0,
        page: 0,
        limit: 20,
        hasMore: false
      };
    }
  }

  // Transform Indeed jobs to our format
  private transformIndeedJobs(indeedJobs: any[]): Job[] {
    return indeedJobs.map(job => ({
      id: `indeed_${job.jobkey}`,
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      type: job.jobType || 'Full-time',
      salary: job.salary || 'Not specified',
      experience: this.extractExperience(job.snippet),
      description: job.snippet,
      requirements: this.extractRequirements(job.snippet),
      benefits: [],
      postedDate: job.formattedRelativeTime,
      deadline: '',
      isRemote: job.remote || false,
      isUrgent: false,
      companyLogo: `https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
      tags: this.extractTags(job.snippet)
    }));
  }

  // Transform LinkedIn jobs to our format
  private transformLinkedInJobs(linkedinJobs: any[]): Job[] {
    return linkedinJobs.map(job => ({
      id: `linkedin_${job.id}`,
      title: job.title,
      company: job.companyName,
      location: job.location,
      type: job.jobType || 'Full-time',
      salary: job.salary || 'Not specified',
      experience: this.extractExperience(job.description),
      description: job.description,
      requirements: this.extractRequirements(job.description),
      benefits: [],
      postedDate: job.postedDate,
      deadline: '',
      isRemote: job.remote || false,
      isUrgent: false,
      companyLogo: `https://logo.clearbit.com/${job.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      tags: this.extractTags(job.description)
    }));
  }

  // Transform RemoteOK jobs to our format
  private transformRemoteOKJobs(remoteJobs: any[]): Job[] {
    return remoteJobs.map(job => ({
      id: `remoteok_${job.id}`,
      title: job.position,
      company: job.company,
      location: job.location || 'Remote',
      type: job.type || 'Full-time',
      salary: job.salary || 'Not specified',
      experience: this.extractExperience(job.description),
      description: job.description,
      requirements: this.extractRequirements(job.description),
      benefits: [],
      postedDate: new Date(job.date).toISOString(),
      deadline: '',
      isRemote: true,
      isUrgent: false,
      companyLogo: job.company_logo || `https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
      tags: this.extractTags(job.description)
    }));
  }

  // Transform GitHub jobs to our format
  private transformGitHubJobs(githubJobs: any[]): Job[] {
    return githubJobs.map(job => ({
      id: `github_${job.id}`,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type || 'Full-time',
      salary: 'Not specified',
      experience: this.extractExperience(job.description),
      description: job.description,
      requirements: this.extractRequirements(job.description),
      benefits: [],
      postedDate: job.created_at,
      deadline: '',
      isRemote: job.location.toLowerCase().includes('remote'),
      isUrgent: false,
      companyLogo: `https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
      tags: this.extractTags(job.description)
    }));
  }

  // Transform Adzuna jobs to our format
  private transformAdzunaJobs(adzunaJobs: any[]): Job[] {
    return adzunaJobs.map(job => ({
      id: `adzuna_${job.id}`,
      title: job.title,
      company: job.company?.display_name || 'Unknown Company',
      location: job.location?.display_name || 'Not specified',
      type: job.contract_type || 'Full-time',
      salary: job.salary_min && job.salary_max ? 
        `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : 'Not specified',
      experience: this.extractExperience(job.description),
      description: job.description,
      requirements: this.extractRequirements(job.description),
      benefits: [],
      postedDate: job.created,
      deadline: '',
      isRemote: job.location?.display_name?.toLowerCase().includes('remote'),
      isUrgent: false,
      companyLogo: `https://logo.clearbit.com/${job.company?.display_name?.toLowerCase().replace(/\s+/g, '')}.com`,
      tags: this.extractTags(job.description)
    }));
  }

  // Helper methods
  private extractExperience(description: string): string {
    const experienceRegex = /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i;
    const match = description.match(experienceRegex);
    return match ? `${match[1]} years` : 'Not specified';
  }

  private extractRequirements(description: string): string[] {
    const requirements = [];
    const commonTech = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'TypeScript', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git'
    ];
    
    commonTech.forEach(tech => {
      if (description.toLowerCase().includes(tech.toLowerCase())) {
        requirements.push(tech);
      }
    });
    
    return requirements;
  }

  private extractTags(description: string): string[] {
    const tags = [];
    const commonTags = [
      'Remote', 'Full-time', 'Part-time', 'Contract', 'Senior', 'Junior',
      'Frontend', 'Backend', 'Full-stack', 'DevOps', 'Mobile', 'Web'
    ];
    
    commonTags.forEach(tag => {
      if (description.toLowerCase().includes(tag.toLowerCase())) {
        tags.push(tag);
      }
    });
    
    return tags;
  }

  private removeDuplicateJobs(jobs: Job[]): Job[] {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}_${job.company.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

export const realJobDataService = new RealJobDataService();
export default realJobDataService;
