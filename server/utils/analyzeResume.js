// AI Resume Analysis Engine
// Comprehensive skill extraction, scoring, and job matching

const SKILL_DATABASE = {
  'web_development': {
    skills: ['html', 'css', 'javascript', 'typescript', 'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js', 'next.js', 'nextjs', 'nuxt', 'svelte', 'jquery', 'bootstrap', 'tailwind', 'tailwindcss', 'sass', 'scss', 'less', 'webpack', 'vite', 'babel', 'npm', 'yarn', 'pnpm', 'redux', 'zustand', 'graphql', 'rest', 'restful', 'api', 'responsive design', 'pwa', 'web components', 'dom', 'ajax'],
    title: 'Web Developer',
    relatedJobs: ['Frontend Developer', 'Full Stack Developer', 'UI Developer', 'Web Developer', 'JavaScript Developer', 'React Developer', 'Angular Developer'],
  },
  'backend_development': {
    skills: ['node', 'nodejs', 'node.js', 'express', 'expressjs', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'springboot', 'ruby on rails', 'rails', 'laravel', 'php', 'asp.net', '.net', 'dotnet', 'golang', 'go', 'rust', 'microservices', 'socket.io', 'websocket', 'nginx', 'apache', 'middleware'],
    title: 'Backend Developer',
    relatedJobs: ['Backend Developer', 'Node.js Developer', 'Python Developer', 'Java Developer', 'API Developer', 'Software Engineer'],
  },
  'mobile_development': {
    skills: ['react native', 'flutter', 'dart', 'swift', 'swiftui', 'kotlin', 'java android', 'android', 'ios', 'xamarin', 'ionic', 'capacitor', 'expo', 'mobile development', 'app development'],
    title: 'Mobile Developer',
    relatedJobs: ['Mobile Developer', 'iOS Developer', 'Android Developer', 'React Native Developer', 'Flutter Developer', 'App Developer'],
  },
  'data_science': {
    skills: ['python', 'r', 'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'plotly', 'jupyter', 'scikit-learn', 'sklearn', 'statistics', 'data analysis', 'data visualization', 'data mining', 'etl', 'tableau', 'power bi', 'powerbi', 'excel', 'sas', 'spss', 'stata', 'data wrangling'],
    title: 'Data Scientist',
    relatedJobs: ['Data Scientist', 'Data Analyst', 'Business Analyst', 'Data Engineer', 'Analytics Engineer', 'BI Developer'],
  },
  'machine_learning': {
    skills: ['machine learning', 'deep learning', 'neural network', 'tensorflow', 'pytorch', 'keras', 'nlp', 'natural language processing', 'computer vision', 'opencv', 'reinforcement learning', 'gans', 'transformer', 'bert', 'gpt', 'llm', 'large language model', 'ai', 'artificial intelligence', 'feature engineering', 'model deployment', 'mlops', 'hugging face', 'langchain'],
    title: 'ML Engineer',
    relatedJobs: ['Machine Learning Engineer', 'AI Engineer', 'Deep Learning Engineer', 'NLP Engineer', 'Computer Vision Engineer', 'AI/ML Researcher'],
  },
  'devops': {
    skills: ['docker', 'kubernetes', 'k8s', 'jenkins', 'ci/cd', 'cicd', 'aws', 'azure', 'gcp', 'google cloud', 'terraform', 'ansible', 'puppet', 'chef', 'linux', 'unix', 'bash', 'shell scripting', 'prometheus', 'grafana', 'elk', 'cloudformation', 'serverless', 'lambda', 'ec2', 's3', 'cloud computing', 'infrastructure'],
    title: 'DevOps Engineer',
    relatedJobs: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer', 'Platform Engineer', 'Infrastructure Engineer', 'Systems Engineer'],
  },
  'database': {
    skills: ['sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'firebase', 'supabase', 'oracle', 'sql server', 'sqlite', 'neo4j', 'database design', 'database administration', 'nosql', 'stored procedures', 'indexing'],
    title: 'Database Engineer',
    relatedJobs: ['Database Administrator', 'Database Engineer', 'Data Engineer', 'Backend Developer'],
  },
  'cybersecurity': {
    skills: ['cybersecurity', 'security', 'penetration testing', 'ethical hacking', 'vulnerability', 'firewall', 'encryption', 'ssl', 'tls', 'oauth', 'authentication', 'authorization', 'siem', 'ids', 'ips', 'soc', 'compliance', 'gdpr', 'iso 27001', 'nist', 'owasp', 'malware', 'forensics'],
    title: 'Security Engineer',
    relatedJobs: ['Security Engineer', 'Cybersecurity Analyst', 'Penetration Tester', 'Security Architect', 'SOC Analyst', 'Information Security Analyst'],
  },
  'ui_ux_design': {
    skills: ['figma', 'sketch', 'adobe xd', 'invision', 'prototype', 'prototyping', 'wireframe', 'wireframing', 'user research', 'usability', 'user experience', 'user interface', 'ui design', 'ux design', 'interaction design', 'visual design', 'design thinking', 'persona', 'user flow', 'accessibility', 'a11y', 'photoshop', 'illustrator', 'canva'],
    title: 'UI/UX Designer',
    relatedJobs: ['UI/UX Designer', 'Product Designer', 'UX Researcher', 'Visual Designer', 'Interaction Designer', 'Design Lead'],
  },
  'project_management': {
    skills: ['agile', 'scrum', 'kanban', 'jira', 'confluence', 'trello', 'asana', 'project management', 'product management', 'stakeholder', 'roadmap', 'sprint', 'backlog', 'requirements', 'risk management', 'pmp', 'prince2', 'lean', 'six sigma', 'okr', 'kpi'],
    title: 'Project Manager',
    relatedJobs: ['Project Manager', 'Product Manager', 'Scrum Master', 'Agile Coach', 'Program Manager', 'Technical Project Manager'],
  },
};

const EXPERIENCE_KEYWORDS = {
  years: /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)/gi,
  internship: /intern(?:ship)?/gi,
  junior: /junior|entry[\s-]?level|associate|fresher|fresh graduate/gi,
  mid: /mid[\s-]?(?:level|senior)|(?:3|4|5)\+?\s*years/gi,
  senior: /senior|lead|principal|staff|(?:6|7|8|9|10)\+?\s*years/gi,
  executive: /director|vp|vice president|cto|ceo|cfo|head of|chief/gi,
};

const EDUCATION_KEYWORDS = [
  'bachelor', 'b.tech', 'btech', 'b.sc', 'bsc', 'b.e', 'be',
  'master', 'm.tech', 'mtech', 'm.sc', 'msc', 'mba', 'm.e',
  'ph.d', 'phd', 'doctorate',
  'diploma', 'associate degree',
  'computer science', 'information technology', 'software engineering',
  'electrical engineering', 'mechanical engineering', 'data science',
  'mathematics', 'statistics', 'physics', 'business administration',
  'university', 'college', 'institute', 'school',
];

const STRENGTH_PATTERNS = [
  { pattern: /(?:led|managed|supervised)\s+(?:a\s+)?team/gi, strength: 'Leadership & Team Management' },
  { pattern: /(?:increased|improved|boosted|grew)\s+.*?(?:\d+%|\d+\s*percent)/gi, strength: 'Quantifiable Achievements' },
  { pattern: /(?:designed|architected|built)\s+.*?(?:system|platform|application|solution)/gi, strength: 'System Design & Architecture' },
  { pattern: /(?:published|presented|authored)\s+.*?(?:paper|article|research|conference)/gi, strength: 'Research & Publications' },
  { pattern: /(?:certified|certification)\s+.*?(?:aws|azure|google|scrum|pmp)/gi, strength: 'Industry Certifications' },
  { pattern: /(?:open[\s-]?source|github|contribution)/gi, strength: 'Open Source Contributions' },
  { pattern: /(?:mentor|coached|trained)\s+.*?(?:team|developer|engineer|student)/gi, strength: 'Mentorship' },
  { pattern: /(?:agile|scrum|kanban|sprint)/gi, strength: 'Agile Methodology Experience' },
];

function extractSkills(text) {
  const lowerText = text.toLowerCase();
  const foundSkills = new Set();
  const categoryScores = {};

  for (const [category, data] of Object.entries(SKILL_DATABASE)) {
    let count = 0;
    for (const skill of data.skills) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerText)) {
        foundSkills.add(skill.charAt(0).toUpperCase() + skill.slice(1));
        count++;
      }
    }
    if (count > 0) {
      categoryScores[category] = {
        count,
        percentage: Math.round((count / data.skills.length) * 100),
        title: data.title,
        relatedJobs: data.relatedJobs,
      };
    }
  }

  return { skills: Array.from(foundSkills), categoryScores };
}

function extractExperience(text) {
  const lowerText = text.toLowerCase();
  let years = 0;
  let level = 'Entry Level';

  const yearMatch = text.match(EXPERIENCE_KEYWORDS.years);
  if (yearMatch) {
    const nums = yearMatch.map(m => parseInt(m.match(/\d+/)?.[0] || '0'));
    years = Math.max(...nums);
  }

  if (EXPERIENCE_KEYWORDS.executive.test(lowerText)) {
    level = 'Executive';
    if (years === 0) years = 10;
  } else if (EXPERIENCE_KEYWORDS.senior.test(lowerText)) {
    level = 'Senior';
    if (years === 0) years = 6;
  } else if (EXPERIENCE_KEYWORDS.mid.test(lowerText)) {
    level = 'Mid Level';
    if (years === 0) years = 3;
  } else if (EXPERIENCE_KEYWORDS.junior.test(lowerText)) {
    level = 'Junior';
    if (years === 0) years = 1;
  } else if (EXPERIENCE_KEYWORDS.internship.test(lowerText)) {
    level = 'Intern';
    years = 0;
  }

  return { years, level };
}

function extractEducation(text) {
  const lowerText = text.toLowerCase();
  const found = [];

  for (const keyword of EDUCATION_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(lowerText)) {
      found.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  }

  return [...new Set(found)];
}

function findStrengths(text) {
  const strengths = new Set();

  for (const { pattern, strength } of STRENGTH_PATTERNS) {
    if (pattern.test(text)) {
      strengths.add(strength);
    }
    pattern.lastIndex = 0; // Reset regex
  }

  // Check for contact info completeness
  if (/[\w.-]+@[\w.-]+\.\w+/.test(text)) strengths.add('Professional Email Provided');
  if (/linkedin\.com/i.test(text)) strengths.add('LinkedIn Profile Included');
  if (/github\.com/i.test(text)) strengths.add('GitHub Profile Included');
  if (/portfolio|personal\s*website/i.test(text)) strengths.add('Portfolio/Website Included');

  return Array.from(strengths);
}

function findWeaknesses(text, skills, education, experience) {
  const weaknesses = [];

  if (skills.length < 5) weaknesses.push('Limited technical skills listed — consider adding more relevant skills');
  if (education.length === 0) weaknesses.push('No education details found — add your educational background');
  if (experience.years === 0 && experience.level === 'Entry Level') weaknesses.push('No clear experience timeline — quantify your experience in years');
  if (!(/[\w.-]+@[\w.-]+\.\w+/.test(text))) weaknesses.push('No email address found — add professional contact information');
  if (!/linkedin\.com/i.test(text)) weaknesses.push('No LinkedIn profile — add your LinkedIn URL');
  if (!/github\.com/i.test(text)) weaknesses.push('No GitHub profile — showcase your code repositories');
  if (text.length < 500) weaknesses.push('Resume is too short — add more details about your experience and projects');
  if (text.length > 5000) weaknesses.push('Resume may be too long — consider condensing to 1-2 pages');
  if (!(/\d+%|\d+\s*percent|increased|improved|reduced|saved/i.test(text))) weaknesses.push('No quantifiable achievements — add metrics and numbers to demonstrate impact');
  if (!/project/i.test(text)) weaknesses.push('No projects section — add relevant projects to showcase practical skills');
  if (!/summary|objective|about/i.test(text)) weaknesses.push('No professional summary — add a brief summary at the top');

  return weaknesses;
}

function generateSuggestions(weaknesses, categoryScores) {
  const suggestions = [];

  if (weaknesses.length > 5) {
    suggestions.push('Your resume needs significant improvements. Focus on the key weaknesses identified above.');
  }

  const topCategory = Object.entries(categoryScores)
    .sort((a, b) => b[1].count - a[1].count)[0];

  if (topCategory) {
    suggestions.push(`Your strongest area is ${topCategory[1].title}. Highlight this prominently in your resume.`);
    suggestions.push(`Consider getting certified in ${topCategory[0].replace(/_/g, ' ')} to strengthen your profile.`);
  }

  suggestions.push('Use action verbs like "Developed", "Implemented", "Designed", "Optimized" to start bullet points.');
  suggestions.push('Tailor your resume for each job application by matching keywords from the job description.');
  suggestions.push('Keep your resume to 1-2 pages maximum for the best impact.');
  suggestions.push('Add a professional summary or objective statement at the top of your resume.');

  return suggestions;
}

function calculateScore(skills, education, experience, strengths, weaknesses, text) {
  let score = 30; // Base score

  // Skills scoring (max 25 points)
  score += Math.min(skills.length * 2, 25);

  // Education scoring (max 10 points)
  score += Math.min(education.length * 3, 10);

  // Experience scoring (max 15 points)
  score += Math.min(experience.years * 2, 15);

  // Strengths scoring (max 10 points)
  score += Math.min(strengths.length * 2, 10);

  // Weakness penalty (max -15 points)
  score -= Math.min(weaknesses.length * 1.5, 15);

  // Length bonus
  if (text.length >= 800 && text.length <= 3000) score += 5;

  // Contact info bonus
  if (/[\w.-]+@[\w.-]+\.\w+/.test(text)) score += 2;
  if (/\+?\d[\d\s-]{8,}/.test(text)) score += 2;
  if (/linkedin\.com/i.test(text)) score += 1;

  return Math.max(10, Math.min(Math.round(score), 100));
}

function generateJobSuggestions(categoryScores, experience) {
  const jobs = [];
  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3);

  const platforms = [
    { name: 'LinkedIn', baseUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
    { name: 'Indeed', baseUrl: 'https://www.indeed.com/jobs?q=' },
    { name: 'Glassdoor', baseUrl: 'https://www.glassdoor.com/Job/jobs.htm?sc.keyword=' },
    { name: 'Naukri', baseUrl: 'https://www.naukri.com/jobs-in-india?k=' },
    { name: 'Google Jobs', baseUrl: 'https://www.google.com/search?q=jobs+' },
  ];

  for (const [category, data] of sortedCategories) {
    for (const jobTitle of data.relatedJobs.slice(0, 3)) {
      const expLevel = experience.level !== 'Entry Level' ? ` ${experience.level}` : '';
      const searchQuery = encodeURIComponent(`${jobTitle}${expLevel}`);

      for (const platform of platforms) {
        jobs.push({
          title: jobTitle,
          company: `Search on ${platform.name}`,
          location: 'Multiple Locations',
          platform: platform.name,
          url: `${platform.baseUrl}${searchQuery}`,
          matchScore: data.percentage,
        });
      }
    }
  }

  // Sort by match score and limit
  return jobs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 30);
}

function analyzeResume(text) {
  if (!text || text.trim().length === 0) {
    return {
      overallScore: 0,
      skills: [],
      experience: { years: 0, level: 'Unknown' },
      education: [],
      strengths: [],
      weaknesses: ['No content found in the resume'],
      suggestions: ['Please upload a valid resume with readable text content'],
      keywords: [],
      categoryMatch: 'None',
      jobSuggestions: [],
    };
  }

  const { skills, categoryScores } = extractSkills(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);
  const strengths = findStrengths(text);
  const weaknesses = findWeaknesses(text, skills, education, experience);
  const suggestions = generateSuggestions(weaknesses, categoryScores);
  const overallScore = calculateScore(skills, education, experience, strengths, weaknesses, text);

  const topCategory = Object.entries(categoryScores)
    .sort((a, b) => b[1].count - a[1].count)[0];

  const jobSuggestions = generateJobSuggestions(categoryScores, experience);

  // Extract important keywords
  const keywords = skills.slice(0, 15);

  return {
    overallScore,
    skills,
    experience,
    education,
    strengths,
    weaknesses,
    suggestions,
    keywords,
    categoryMatch: topCategory ? topCategory[1].title : 'General',
    jobSuggestions,
  };
}

module.exports = { analyzeResume };
