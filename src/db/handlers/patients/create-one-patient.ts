import { PatientDatabase } from "../../init-pglite-instance";
import { createOnePatientWriteQuery } from "../../queries/writes/patients/create-one-patient";
import {
  CreatePatientInputSchema,
  type CreatePatientInput,
} from "../types/patient/create-patient";

export async function createOnePatient({
  input,
}: {
  input: CreatePatientInput;
}) {
  const parsed = CreatePatientInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(parsed.error.format())}`
    );
  }

  const patient = parsed.data;

  const db = await PatientDatabase.getInstance();

  const params = [
    patient.first_name,
    patient.last_name ?? null,
    patient.date_of_birth,
    patient.gender,
    patient.phone,
    patient.email,
    patient.address,
    patient.city,
    patient.state,
    patient.zip_code,

    patient.emergency_contact_names ?? null,
    patient.emergency_contact_phones ?? null,
    patient.emergency_contact_relationships ?? null,

    patient.insurance_provider ?? null,
    patient.insurance_policy_number ?? null,

    patient.medical_record_number ?? null,
    patient.blood_type ?? null,
    patient.allergies ?? null,
    patient.current_medications ?? null,
    patient.medical_history ?? null,
    patient.family_history ?? null,

    patient.preferred_language ?? "English",
    patient.is_active ?? true,
  ];

  const result = await db.query(createOnePatientWriteQuery, params);
  return result.rows[0];
}
