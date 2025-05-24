import { z } from "zod";

export const CreatePatientInputSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().optional(),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip_code: z.string(),

  emergency_contact_names: z.array(z.string()).optional(),
  emergency_contact_phones: z.array(z.string()).optional(),
  emergency_contact_relationships: z.array(z.string()).optional(),

  insurance_provider: z.string().optional(),
  insurance_policy_number: z.string().optional(),

  medical_record_number: z.string().optional(),
  blood_type: z.string().optional(),
  allergies: z.string().optional(),
  current_medications: z.string().optional(),
  medical_history: z.string().optional(),
  family_history: z.string().optional(),

  preferred_language: z.string().default("English"),
  is_active: z.boolean().default(true),
});
export type CreatePatientInput = z.infer<typeof CreatePatientInputSchema>;

export const GENDERS = ["male", "female", "other"] as const;
export const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const GenderSchema = z.enum(GENDERS);
export const BloodTypeSchema = z.enum(BLOOD_TYPES);

export type Gender = z.infer<typeof GenderSchema>;
export type BloodType = z.infer<typeof BloodTypeSchema>;
