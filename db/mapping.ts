export interface FieldMapping {
  id: number;
  sourceOrgId: number;
  targetOrgId: number;
  mappingConfig: Record<string, any>;
  createdAt: Date;
}

export interface CreateFieldMappingInput {
  sourceOrgId: number;
  targetOrgId: number;
  mappingConfig: Record<string, any>;
}
