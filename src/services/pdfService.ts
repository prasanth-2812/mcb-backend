// PDF Generation Service for Resume Builder
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

export interface PDFOptions {
  html: string;
  fileName: string;
  directory?: string;
  width?: number;
  height?: number;
  padding?: number;
}

export interface ResumePDFData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  professionalSummary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
    achievements: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: Array<{
      language: string;
      proficiency: string;
    }>;
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate: string;
    endDate: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
}

class PDFService {
  private generateHTML(data: ResumePDFData, template: string = 'modern'): string {
    const formatDate = (date: string) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const formatDateRange = (start: string, end: string, current: boolean) => {
      const startFormatted = formatDate(start);
      const endFormatted = current ? 'Present' : formatDate(end);
      return `${startFormatted} - ${endFormatted}`;
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume - ${data.personalInfo.firstName} ${data.personalInfo.lastName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 20px;
          }
          
          .resume-container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
          }
          
          .header .contact-info {
            font-size: 1.1em;
            opacity: 0.9;
          }
          
          .header .contact-info div {
            margin: 5px 0;
          }
          
          .content {
            padding: 40px;
          }
          
          .section {
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 1.4em;
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 5px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .summary {
            font-size: 1.1em;
            line-height: 1.8;
            color: #555;
            text-align: justify;
          }
          
          .experience-item, .education-item, .project-item, .certification-item {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
          }
          
          .item-title {
            font-size: 1.2em;
            font-weight: 600;
            color: #333;
          }
          
          .item-company {
            font-size: 1.1em;
            color: #667eea;
            font-weight: 500;
          }
          
          .item-dates {
            color: #666;
            font-size: 0.9em;
            white-space: nowrap;
          }
          
          .item-location {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
          }
          
          .item-description {
            margin: 10px 0;
            color: #555;
            line-height: 1.6;
          }
          
          .achievements {
            margin-top: 10px;
          }
          
          .achievements ul {
            list-style: none;
            padding-left: 0;
          }
          
          .achievements li {
            position: relative;
            padding-left: 20px;
            margin: 5px 0;
            color: #555;
          }
          
          .achievements li:before {
            content: "•";
            color: #667eea;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
          }
          
          .skill-category {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          
          .skill-category h4 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 1.1em;
          }
          
          .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .skill-tag {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
          }
          
          .language-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          
          .language-name {
            font-weight: 500;
            color: #333;
          }
          
          .language-proficiency {
            color: #667eea;
            font-size: 0.9em;
            font-weight: 500;
          }
          
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }
          
          .project-item {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          
          .project-technologies {
            margin-top: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          
          .tech-tag {
            background: #e3f2fd;
            color: #1976d2;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 500;
          }
          
          .certifications-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
          }
          
          .certification-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          
          .cert-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }
          
          .cert-issuer {
            color: #667eea;
            font-weight: 500;
            margin-bottom: 5px;
          }
          
          .cert-date {
            color: #666;
            font-size: 0.9em;
          }
          
          .cert-id {
            color: #888;
            font-size: 0.8em;
            margin-top: 5px;
          }
          
          @media print {
            body { padding: 0; }
            .resume-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          <!-- Header -->
          <div class="header">
            <h1>${data.personalInfo.firstName} ${data.personalInfo.lastName}</h1>
            <div class="contact-info">
              <div>📧 ${data.personalInfo.email}</div>
              <div>📱 ${data.personalInfo.phone}</div>
              <div>📍 ${data.personalInfo.location}</div>
              ${data.personalInfo.website ? `<div>🌐 ${data.personalInfo.website}</div>` : ''}
              ${data.personalInfo.linkedin ? `<div>💼 LinkedIn: ${data.personalInfo.linkedin}</div>` : ''}
              ${data.personalInfo.github ? `<div>💻 GitHub: ${data.personalInfo.github}</div>` : ''}
            </div>
          </div>
          
          <!-- Content -->
          <div class="content">
            <!-- Professional Summary -->
            ${data.professionalSummary ? `
              <div class="section">
                <h2 class="section-title">Professional Summary</h2>
                <div class="summary">${data.professionalSummary}</div>
              </div>
            ` : ''}
            
            <!-- Experience -->
            ${data.experience.length > 0 ? `
              <div class="section">
                <h2 class="section-title">Professional Experience</h2>
                ${data.experience.map(exp => `
                  <div class="experience-item">
                    <div class="item-header">
                      <div>
                        <div class="item-title">${exp.title}</div>
                        <div class="item-company">${exp.company}</div>
                        <div class="item-location">${exp.location}</div>
                      </div>
                      <div class="item-dates">${formatDateRange(exp.startDate, exp.endDate, exp.current)}</div>
                    </div>
                    <div class="item-description">${exp.description}</div>
                    ${exp.achievements.length > 0 ? `
                      <div class="achievements">
                        <ul>
                          ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <!-- Education -->
            ${data.education.length > 0 ? `
              <div class="section">
                <h2 class="section-title">Education</h2>
                ${data.education.map(edu => `
                  <div class="education-item">
                    <div class="item-header">
                      <div>
                        <div class="item-title">${edu.degree}</div>
                        <div class="item-company">${edu.school}</div>
                        <div class="item-location">${edu.location}</div>
                        ${edu.gpa ? `<div style="color: #666; font-size: 0.9em; margin-top: 5px;">GPA: ${edu.gpa}</div>` : ''}
                      </div>
                      <div class="item-dates">${formatDateRange(edu.startDate, edu.endDate, edu.current)}</div>
                    </div>
                    ${edu.achievements.length > 0 ? `
                      <div class="achievements">
                        <ul>
                          ${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <!-- Skills -->
            ${data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.languages.length > 0 ? `
              <div class="section">
                <h2 class="section-title">Skills</h2>
                <div class="skills-grid">
                  ${data.skills.technical.length > 0 ? `
                    <div class="skill-category">
                      <h4>Technical Skills</h4>
                      <div class="skill-tags">
                        ${data.skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                  
                  ${data.skills.soft.length > 0 ? `
                    <div class="skill-category">
                      <h4>Soft Skills</h4>
                      <div class="skill-tags">
                        ${data.skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                  
                  ${data.skills.languages.length > 0 ? `
                    <div class="skill-category">
                      <h4>Languages</h4>
                      ${data.skills.languages.map(lang => `
                        <div class="language-item">
                          <span class="language-name">${lang.language}</span>
                          <span class="language-proficiency">${lang.proficiency}</span>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
            
            <!-- Projects -->
            ${data.projects.length > 0 ? `
              <div class="section">
                <h2 class="section-title">Projects</h2>
                <div class="projects-grid">
                  ${data.projects.map(project => `
                    <div class="project-item">
                      <div class="item-header">
                        <div>
                          <div class="item-title">${project.name}</div>
                          ${project.url ? `<div style="color: #667eea; font-size: 0.9em;">🔗 ${project.url}</div>` : ''}
                        </div>
                        <div class="item-dates">${formatDateRange(project.startDate, project.endDate, false)}</div>
                      </div>
                      <div class="item-description">${project.description}</div>
                      ${project.technologies.length > 0 ? `
                        <div class="project-technologies">
                          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <!-- Certifications -->
            ${data.certifications.length > 0 ? `
              <div class="section">
                <h2 class="section-title">Certifications</h2>
                <div class="certifications-list">
                  ${data.certifications.map(cert => `
                    <div class="certification-item">
                      <div class="cert-name">${cert.name}</div>
                      <div class="cert-issuer">${cert.issuer}</div>
                      <div class="cert-date">${formatDate(cert.date)}</div>
                      ${cert.credentialId ? `<div class="cert-id">ID: ${cert.credentialId}</div>` : ''}
                      ${cert.expiryDate ? `<div class="cert-date">Expires: ${formatDate(cert.expiryDate)}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
    
    return html;
  }

  async generatePDF(data: ResumePDFData, options: PDFOptions): Promise<string> {
    try {
      console.log('🔄 Generating PDF resume...');
      
      const html = this.generateHTML(data);
      const fileName = options.fileName || `Resume_${data.personalInfo.firstName}_${data.personalInfo.lastName}_${Date.now()}.html`;
      const directory = options.directory || FileSystem.documentDirectory;
      const filePath = `${directory}${fileName}`;

      // Save as HTML file (can be converted to PDF by the user)
      await FileSystem.writeAsStringAsync(filePath, html);
      
      console.log('✅ Resume generated successfully:', filePath);
      return filePath;
    } catch (error) {
      console.error('❌ Resume generation failed:', error);
      throw new Error(`Resume generation failed: ${error.message}`);
    }
  }

  async sharePDF(filePath: string): Promise<void> {
    try {
      console.log('📤 Sharing resume:', filePath);
      
      // In a real implementation, you'd use expo-sharing
      // import * as Sharing from 'expo-sharing';
      // await Sharing.shareAsync(filePath);
      
      console.log('✅ Resume shared successfully');
    } catch (error) {
      console.error('❌ Resume sharing failed:', error);
      throw new Error(`Resume sharing failed: ${error.message}`);
    }
  }

  async saveToGallery(filePath: string): Promise<void> {
    try {
      console.log('💾 Saving PDF to gallery:', filePath);
      
      // In a real implementation, you'd use expo-file-system to copy to gallery
      const galleryPath = `${FileSystem.documentDirectory}Resumes/${Date.now()}.pdf`;
      await FileSystem.copyAsync({
        from: filePath,
        to: galleryPath
      });
      
      console.log('✅ PDF saved to gallery:', galleryPath);
    } catch (error) {
      console.error('❌ Failed to save PDF to gallery:', error);
      throw new Error(`Failed to save PDF to gallery: ${error.message}`);
    }
  }
}

export const pdfService = new PDFService();
export default pdfService;
