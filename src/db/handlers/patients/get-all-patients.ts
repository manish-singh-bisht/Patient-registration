import { calculateOffset } from "../../../utils";
import { PatientDatabase } from "../../init-pglite-instance";
import { getAllPatientsReadQuery } from "../../queries/reads/patients/get-many";
import {
  GetAllPatientsInputSchema,
  type GetAllPatientsInput,
} from "../types/patient/get-all-patient";

export async function getAllPatients({
  input,
}: {
  input: GetAllPatientsInput;
}) {
  const parsed = GetAllPatientsInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(
      `Invalid pagination params: ${JSON.stringify(parsed.error.format())}`
    );
  }

  const { page, limit } = parsed.data;

  const db = await PatientDatabase.getInstance();

  const offset = calculateOffset({ page, limit });

  const result = await db.query(getAllPatientsReadQuery, [limit, offset]);

  return result.rows;
}
