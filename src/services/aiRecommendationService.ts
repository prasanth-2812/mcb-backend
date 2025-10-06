// AI-Powered Job Recommendation Service
import { Job, UserProfile } from '../types';

export interface JobMatch {
  job: Job;
  matchScore: number;
  matchReasons: string[];
  skillMatches: string[];
  missingSkills: string[];
  salaryMatch: boolean;
  locationMatch: boolean;
  experienceMatch: boolean;
}

export interface RecommendationProfile {
  skills: string[];
  experience: string;
  location: string;
  salaryExpectation: number;
  jobTypes: string[];
  industries: string[];
  remotePreference: boolean;
  companySizePreference: string[];
}

export interface AIInsights {
  topSkills: string[];
  skillGaps: string[];
  careerSuggestions: string[];
  salaryInsights: {
    current: number;
    market: number;
    potential: number;
  };
  locationInsights: {
    current: string;
    opportunities: string[];
    remoteOpportunities: number;
  };
}

class AIRecommendationService {
  private readonly API_KEY = process.env.OPENAI_API_KEY || 'your_openai_api_key';
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions';

  // Generate job recommendations based on user profile
  async getJobRecommendations(
    userProfile: UserProfile, 
    availableJobs: Job[], 
    limit: number = 10
  ): Promise<JobMatch[]> {
    try {
      console.log('🤖 Generating AI job recommendations...');
      
      const recommendationProfile = this.buildRecommendationProfile(userProfile);
      const matches: JobMatch[] = [];

      for (const job of availableJobs) {
        const match = await this.calculateJobMatch(job, recommendationProfile);
        if (match.matchScore > 0.3) { // Only include jobs with >30% match
          matches.push(match);
        }
      }

      // Sort by match score and return top matches
      const sortedMatches = matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      console.log(`✅ Generated ${sortedMatches.length} AI recommendations`);
      return sortedMatches;
    } catch (error) {
      console.error('❌ AI recommendation generation failed:', error);
      return [];
    }
  }

  // Get AI insights about user's career profile
  async getCareerInsights(userProfile: UserProfile, marketData: any): Promise<AIInsights> {
    try {
      console.log('🧠 Generating AI career insights...');
      
      const insights: AIInsights = {
        topSkills: this.extractTopSkills(userProfile),
        skillGaps: this.identifySkillGaps(userProfile, marketData),
        careerSuggestions: await this.generateCareerSuggestions(userProfile),
        salaryInsights: this.analyzeSalaryInsights(userProfile, marketData),
        locationInsights: this.analyzeLocationInsights(userProfile, marketData)
      };

      console.log('✅ AI career insights generated');
      return insights;
    } catch (error) {
      console.error('❌ AI insights generation failed:', error);
      return {
        topSkills: [],
        skillGaps: [],
        careerSuggestions: [],
        salaryInsights: { current: 0, market: 0, potential: 0 },
        locationInsights: { current: '', opportunities: [], remoteOpportunities: 0 }
      };
    }
  }

  // Generate personalized job search suggestions
  async getSearchSuggestions(userProfile: UserProfile): Promise<string[]> {
    try {
      console.log('💡 Generating AI search suggestions...');
      
      const suggestions: string[] = [];
      
      // Skill-based suggestions
      const skills = userProfile.skills || [];
      if (skills.length > 0) {
        suggestions.push(`${skills[0]} developer jobs`);
        suggestions.push(`Senior ${skills[0]} positions`);
      }

      // Location-based suggestions
      if (userProfile.location) {
        suggestions.push(`Remote ${userProfile.preferences?.role || 'developer'} jobs`);
        suggestions.push(`Jobs in ${userProfile.location}`);
      }

      // Industry-based suggestions
      if (userProfile.preferences?.role) {
        suggestions.push(`${userProfile.preferences.role} positions`);
        suggestions.push(`Entry level ${userProfile.preferences.role} jobs`);
      }

      // AI-generated suggestions using OpenAI
      const aiSuggestions = await this.generateAISearchSuggestions(userProfile);
      suggestions.push(...aiSuggestions);

      console.log('✅ AI search suggestions generated');
      return suggestions.slice(0, 8); // Limit to 8 suggestions
    } catch (error) {
      console.error('❌ AI search suggestions failed:', error);
      return [];
    }
  }

  // Private helper methods
  private buildRecommendationProfile(userProfile: UserProfile): RecommendationProfile {
    return {
      skills: userProfile.skills || [],
      experience: this.extractExperienceLevel(userProfile),
      location: userProfile.location || '',
      salaryExpectation: this.extractSalaryExpectation(userProfile),
      jobTypes: [userProfile.preferences?.type || 'Full-time'],
      industries: this.extractIndustries(userProfile),
      remotePreference: this.extractRemotePreference(userProfile),
      companySizePreference: this.extractCompanySizePreference(userProfile)
    };
  }

  private async calculateJobMatch(job: Job, profile: RecommendationProfile): Promise<JobMatch> {
    const skillMatches = this.calculateSkillMatches(job, profile.skills);
    const missingSkills = this.identifyMissingSkills(job, profile.skills);
    const salaryMatch = this.calculateSalaryMatch(job, profile.salaryExpectation);
    const locationMatch = this.calculateLocationMatch(job, profile);
    const experienceMatch = this.calculateExperienceMatch(job, profile.experience);

    const matchScore = this.calculateOverallMatchScore({
      skillMatches,
      salaryMatch,
      locationMatch,
      experienceMatch,
      missingSkills
    });

    const matchReasons = this.generateMatchReasons({
      skillMatches,
      salaryMatch,
      locationMatch,
      experienceMatch,
      missingSkills
    });

    return {
      job,
      matchScore,
      matchReasons,
      skillMatches,
      missingSkills,
      salaryMatch,
      locationMatch,
      experienceMatch
    };
  }

  private calculateSkillMatches(job: Job, userSkills: string[]): string[] {
    const jobSkills = this.extractJobSkills(job);
    return userSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );
  }

  private identifyMissingSkills(job: Job, userSkills: string[]): string[] {
    const jobSkills = this.extractJobSkills(job);
    return jobSkills.filter(skill => 
      !userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
  }

  private extractJobSkills(job: Job): string[] {
    const skills: string[] = [];
    
    // Extract from requirements
    if (job.requirements) {
      skills.push(...job.requirements);
    }
    
    // Extract from description
    if (job.description) {
      const commonSkills = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
        'TypeScript', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git',
        'Machine Learning', 'Data Science', 'DevOps', 'UI/UX Design'
      ];
      
      commonSkills.forEach(skill => {
        if (job.description.toLowerCase().includes(skill.toLowerCase())) {
          skills.push(skill);
        }
      });
    }
    
    return [...new Set(skills)]; // Remove duplicates
  }

  private calculateSalaryMatch(job: Job, expectedSalary: number): boolean {
    if (!expectedSalary || !job.salary || job.salary === 'Not specified') return true;
    
    const jobSalary = this.extractSalaryFromString(job.salary);
    if (!jobSalary) return true;
    
    // Consider it a match if within 20% of expected salary
    const tolerance = 0.2;
    return Math.abs(jobSalary - expectedSalary) / expectedSalary <= tolerance;
  }

  private calculateLocationMatch(job: Job, profile: RecommendationProfile): boolean {
    if (profile.remotePreference && job.isRemote) return true;
    if (!profile.location) return true;
    
    return job.location.toLowerCase().includes(profile.location.toLowerCase()) ||
           profile.location.toLowerCase().includes(job.location.toLowerCase());
  }

  private calculateExperienceMatch(job: Job, userExperience: string): boolean {
    const jobExperience = this.extractExperienceFromJob(job);
    if (!jobExperience || !userExperience) return true;
    
    const experienceLevels = {
      'entry': 1,
      'junior': 2,
      'mid': 3,
      'senior': 4,
      'lead': 5,
      'principal': 6,
      'executive': 7
    };
    
    const userLevel = experienceLevels[userExperience.toLowerCase()] || 3;
    const jobLevel = experienceLevels[jobExperience.toLowerCase()] || 3;
    
    // Match if user level is within 1 level of job requirement
    return Math.abs(userLevel - jobLevel) <= 1;
  }

  private calculateOverallMatchScore(factors: any): number {
    const weights = {
      skills: 0.4,
      salary: 0.2,
      location: 0.2,
      experience: 0.2
    };
    
    let score = 0;
    
    // Skill match score
    const skillScore = factors.skillMatches.length / (factors.skillMatches.length + factors.missingSkills.length);
    score += skillScore * weights.skills;
    
    // Salary match score
    score += (factors.salaryMatch ? 1 : 0) * weights.salary;
    
    // Location match score
    score += (factors.locationMatch ? 1 : 0) * weights.location;
    
    // Experience match score
    score += (factors.experienceMatch ? 1 : 0) * weights.experience;
    
    return Math.min(score, 1); // Cap at 1.0
  }

  private generateMatchReasons(factors: any): string[] {
    const reasons: string[] = [];
    
    if (factors.skillMatches.length > 0) {
      reasons.push(`Matches ${factors.skillMatches.length} of your skills`);
    }
    
    if (factors.salaryMatch) {
      reasons.push('Salary matches your expectations');
    }
    
    if (factors.locationMatch) {
      reasons.push('Location preference match');
    }
    
    if (factors.experienceMatch) {
      reasons.push('Experience level match');
    }
    
    if (factors.missingSkills.length === 0) {
      reasons.push('Perfect skill match');
    }
    
    return reasons;
  }

  private extractTopSkills(userProfile: UserProfile): string[] {
    return userProfile.skills?.slice(0, 5) || [];
  }

  private identifySkillGaps(userProfile: UserProfile, marketData: any): string[] {
    // This would analyze market trends and identify missing skills
    const commonSkills = [
      'Machine Learning', 'Cloud Computing', 'DevOps', 'Data Science',
      'Cybersecurity', 'Mobile Development', 'Blockchain'
    ];
    
    const userSkills = userProfile.skills || [];
    return commonSkills.filter(skill => 
      !userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  private async generateCareerSuggestions(userProfile: UserProfile): Promise<string[]> {
    try {
      const prompt = `Based on this user profile: ${JSON.stringify(userProfile)}, suggest 3 career development paths. Return as JSON array.`;
      
      // This would call OpenAI API in a real implementation
      // const response = await this.callOpenAI(prompt);
      
      // For now, return mock suggestions
      return [
        'Consider specializing in Machine Learning',
        'Explore leadership roles in your field',
        'Develop expertise in cloud technologies'
      ];
    } catch (error) {
      console.error('❌ Career suggestions generation failed:', error);
      return [];
    }
  }

  private analyzeSalaryInsights(userProfile: UserProfile, marketData: any): any {
    // Mock salary analysis
    return {
      current: 75000,
      market: 85000,
      potential: 95000
    };
  }

  private analyzeLocationInsights(userProfile: UserProfile, marketData: any): any {
    return {
      current: userProfile.location || 'Not specified',
      opportunities: ['San Francisco', 'New York', 'Remote'],
      remoteOpportunities: 45
    };
  }

  private async generateAISearchSuggestions(userProfile: UserProfile): Promise<string[]> {
    try {
      const prompt = `Generate 3 personalized job search suggestions for a user with profile: ${JSON.stringify(userProfile)}. Return as JSON array.`;
      
      // This would call OpenAI API in a real implementation
      // const response = await this.callOpenAI(prompt);
      
      // For now, return mock suggestions
      return [
        'AI/ML Engineer positions',
        'Senior Software Developer roles',
        'Tech Lead opportunities'
      ];
    } catch (error) {
      console.error('❌ AI search suggestions failed:', error);
      return [];
    }
  }

  private extractExperienceLevel(userProfile: UserProfile): string {
    // Analyze user profile to determine experience level
    const skills = userProfile.skills?.length || 0;
    const profileCompletion = userProfile.profileCompletion || 0;
    
    if (skills < 3 || profileCompletion < 30) return 'entry';
    if (skills < 6 || profileCompletion < 60) return 'mid';
    if (skills < 10 || profileCompletion < 80) return 'senior';
    return 'lead';
  }

  private extractSalaryExpectation(userProfile: UserProfile): number {
    // Extract salary expectation from user profile
    // This would be based on user input or market analysis
    return 80000; // Default expectation
  }

  private extractIndustries(userProfile: UserProfile): string[] {
    // Extract preferred industries from user profile
    return ['Technology', 'Software']; // Default industries
  }

  private extractRemotePreference(userProfile: UserProfile): boolean {
    return userProfile.preferences?.type === 'Remote' || false;
  }

  private extractCompanySizePreference(userProfile: UserProfile): string[] {
    return ['Medium', 'Large']; // Default preference
  }

  private extractSalaryFromString(salaryString: string): number | null {
    const match = salaryString.match(/\$?([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    return null;
  }

  private extractExperienceFromJob(job: Job): string {
    if (job.experience) {
      const exp = job.experience.toLowerCase();
      if (exp.includes('entry') || exp.includes('junior')) return 'entry';
      if (exp.includes('senior') || exp.includes('lead')) return 'senior';
      if (exp.includes('mid') || exp.includes('intermediate')) return 'mid';
    }
    return 'mid'; // Default
  }

  private async callOpenAI(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('❌ OpenAI API call failed:', error);
      throw error;
    }
  }
}

export const aiRecommendationService = new AIRecommendationService();
export default aiRecommendationService;
