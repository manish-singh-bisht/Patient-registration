import { PatientDatabase } from "../../init-pglite-instance";
import { createOnePatientWriteQuery } from "../../queries/writes/patients/create-one-patient";

export type PatientInput = {
  first_name: string;
  last_name?: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;

  emergency_contact_names?: string[];
  emergency_contact_phones?: string[];
  emergency_contact_relationships?: string[];

  insurance_provider?: string;
  insurance_policy_number?: string;

  medical_record_number?: string;
  blood_type?: string;
  allergies?: string;
  current_medications?: string;
  medical_history?: string;

  preferred_language?: string;
  is_active?: boolean;
};

export async function createOnePatient({ input }: { input: PatientInput }) {
  const db = await PatientDatabase.getInstance();

  const params = [
    input.first_name,
    input.last_name ?? null,
    input.date_of_birth,
    input.gender,
    input.phone,
    input.email,
    input.address,
    input.city,
    input.state,
    input.zip_code,

    input.emergency_contact_names ?? null,
    input.emergency_contact_phones ?? null,
    input.emergency_contact_relationships ?? null,

    input.insurance_provider ?? null,
    input.insurance_policy_number ?? null,

    input.medical_record_number ?? null,
    input.blood_type ?? null,
    input.allergies ?? null,
    input.current_medications ?? null,
    input.medical_history ?? null,

    input.preferred_language ?? "English",
    input.is_active ?? true,
  ];

  const result = await db.query(createOnePatientWriteQuery, params);
  return result.rows[0];
}
