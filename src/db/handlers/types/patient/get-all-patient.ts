import { z } from "zod";
import { PatientSchema } from "./patient-schema";
import { PaginationSchema } from "../pagination";

export const GetAllPatientsInputSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type GetAllPatientsInput = z.infer<typeof GetAllPatientsInputSchema>;

export const PatientReturnDataSchema = PatientSchema.pick({
  id: true,
  first_name: true,
  last_name: true,
  date_of_birth: true,
  phone: true,
  email: true,
  city: true,
  state: true,
  emergency_contact_names: true,
  emergency_contact_phones: true,
  emergency_contact_relationships: true,
  insurance_provider: true,
  insurance_policy_number: true,
  medical_record_number: true,
  blood_type: true,
  allergies: true,
  preferred_language: true,
  created_at: true,
  updated_at: true,
});

export type PatientReturnData = z.infer<typeof PatientReturnDataSchema>;

export const PaginatedPatientsResultSchema = z.object({
  patients: z.array(PatientReturnDataSchema),
  pagination: PaginationSchema,
});

export type PaginatedPatientsResult = z.infer<
  typeof PaginatedPatientsResultSchema
>;
