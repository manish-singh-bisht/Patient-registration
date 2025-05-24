import { patientSchema } from "../../../schemas/patient";

export const createPatientTableQuery = `

        CREATE TABLE IF NOT EXISTS patient (${patientSchema})
        
        CREATE INDEX IF NOT EXISTS idx_patient_email ON patient(email);
        CREATE INDEX IF NOT EXISTS idx_patient_phone ON patient(phone);
        CREATE INDEX IF NOT EXISTS idx_patient_medical_record_number ON patient(medical_record_number);

`;
