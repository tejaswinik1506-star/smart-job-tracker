export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface ResumeAnalysis {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface DashboardStats {
  totalApplications: number;
  appliedCount: number;
  interviewCount: number;
  offerCount: number;
  rejectedCount: number;
  weeklyData: WeeklyData[];
}

export interface WeeklyData {
  day: string;
  count: number;
}
