import { FieldType } from './enums';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  contactInfo?: Record<string, any>;
  applicationStructure: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationInput {
  name: string;
  description?: string;
  logoUrl?: string;
  contactInfo?: Record<string, any>;
  applicationStructure: FormField[];
}

export interface UpdateOrganizationInput extends Partial<CreateOrganizationInput> {
  id: number;
}
