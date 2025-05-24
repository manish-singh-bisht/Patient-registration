import { z } from "zod";

export const PatientSchema = z.object({
  id: z.string(),
  first_name: z.string().max(100),
  last_name: z.string().max(100).nullable().optional(),
  date_of_birth: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? val : val.toISOString()))
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),

  gender: z.enum(["male", "female", "other"]).nullable().optional(),
  phone: z.string().max(20),
  email: z.string().email().max(255),
  address: z.string(),
  city: z.string().max(100),
  state: z.string().max(50),
  zip_code: z.string().max(20),

  emergency_contact_names: z.array(z.string()).nullable().optional(),
  emergency_contact_phones: z.array(z.string()).nullable().optional(),
  emergency_contact_relationships: z.array(z.string()).nullable().optional(),

  insurance_provider: z.string().max(200).nullable().optional(),
  insurance_policy_number: z.string().max(200).nullable().optional(),

  medical_record_number: z.string().max(50).nullable().optional(),

  blood_type: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .nullable()
    .optional(),

  allergies: z.string().nullable().optional(),
  current_medications: z.string().nullable().optional(),
  medical_history: z.string().nullable().optional(),
  family_history: z.string().nullable().optional(),

  preferred_language: z.string().max(50).default("English"),

  created_at: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? val : val.toISOString()))
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  updated_at: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? val : val.toISOString()))
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),

  is_active: z.boolean().default(true),
});
