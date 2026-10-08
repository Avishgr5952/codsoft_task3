export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';

export type WorkMode = 'REMOTE' | 'HYBRID' | 'ON_SITE';

export type ExperienceLevel = 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'LEAD_EXECUTIVE';

export type JobStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'REJECTED';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  candidateProfileId?: string;
  recruiterProfileId?: string;
  companyId?: string;
}

export interface CompanyItem {
  id: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  location?: string | null;
  companySize?: string | null;
  description?: string | null;
  foundedYear?: number | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  _count?: {
    jobs: number;
    recruiters: number;
  };
}

export interface JobCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  _count?: {
    jobs: number;
  };
}

export interface JobItem {
  id: string;
  title: string;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  skills: string[];
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  deadline?: string | null;
  status: JobStatus;
  viewsCount: number;
  featured: boolean;
  companyId: string;
  company?: CompanyItem;
  recruiterId?: string | null;
  categoryId: string;
  category?: JobCategoryItem;
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
  hasApplied?: boolean;
  _count?: {
    applications: number;
    savedBy: number;
  };
}

export interface ResumeItem {
  id: string;
  candidateProfileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  isDefault: boolean;
  uploadedAt: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: string;
  endDate?: string | null;
  grade?: string | null;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
}

export interface SkillItem {
  id: string;
  name: string;
  category?: string | null;
  yearsOfExperience?: number | null;
}

export interface CandidateProfileItem {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    status: UserStatus;
  };
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  resumes?: ResumeItem[];
  educations?: EducationItem[];
  experiences?: ExperienceItem[];
  skills?: Array<{
    id: string;
    skillId: string;
    yearsOfExperience?: number | null;
    skill: SkillItem;
  }>;
  applications?: ApplicationItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationItem {
  id: string;
  jobId: string;
  job?: JobItem;
  candidateProfileId: string;
  candidateProfile?: CandidateProfileItem;
  resumeId?: string | null;
  resume?: ResumeItem | null;
  coverLetter?: string | null;
  additionalInfo?: string | null;
  status: ApplicationStatus;
  statusUpdatedAt: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  interviews?: InterviewItem[];
}

export interface SavedJobItem {
  id: string;
  userId: string;
  jobId: string;
  job: JobItem;
  createdAt: string;
}

export interface InterviewItem {
  id: string;
  applicationId: string;
  scheduledAt: string;
  locationOrLink?: string | null;
  interviewType: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}
