export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  REMOTE = 'Remote',
  INTERNSHIP = 'Internship'
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  salaryRange: string;
  description: string; // Markdown or plain text
  postedAt: number;
  requirements: string[];
  applyLink?: string; // For external jobs
  deadline?: string;  // Application deadline
  imageUrl?: string;  // URL for job poster or company logo
}

export interface Application {
  jobId: string;
  applicantName: string;
  email: string;
  resumeLink?: string;
  coverLetter: string;
}

export type ViewState = 
  | { type: 'LIST' }
  | { type: 'DETAILS'; jobId: string }
  | { type: 'POST' }
  | { type: 'APPLY'; jobId: string }
  | { type: 'DISCOVER' };