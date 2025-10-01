export interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicantInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export interface UpdateApplicantInput extends Partial<CreateApplicantInput> {
  id: number;
}
