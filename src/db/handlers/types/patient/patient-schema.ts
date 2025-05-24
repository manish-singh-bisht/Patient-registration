import { z } from "zod";

export const PatientSchema = z.object({
  id: z.string(),
  first_name: z.string().max(100),
  last_name: z.string().max(100).optional(),
  date_of_birth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  gender: z.enum(["male", "female", "other"]).optional(),
  phone: z.string().max(20),
  email: z.string().email().max(255),
  address: z.string(),
  city: z.string().max(100),
  state: z.string().max(50),
  zip_code: z.string().max(20),

  emergency_contact_names: z.array(z.string()).optional(),
  emergency_contact_phones: z.array(z.string()).optional(),
  emergency_contact_relationships: z.array(z.string()).optional(),

  insurance_provider: z.string().max(200).optional(),
  insurance_policy_number: z.string().max(200).optional(),

  medical_record_number: z.string().max(50).optional(),

  blood_type: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),

  allergies: z.string().optional(),
  current_medications: z.string().optional(),
  medical_history: z.string().optional(),
  family_history: z.string().optional(),

  preferred_language: z.string().max(50).default("English"),

  created_at: z.string(),
  updated_at: z.string(),

  is_active: z.boolean().default(true),
});
