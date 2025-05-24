import { calculateOffset } from "../../../utils";
import { PatientDatabase } from "../../init-pglite-instance";
import { getAllPatientsReadQuery } from "../../queries/reads/patients/get-many";

export async function getAllPatients({
  page = 1,
  limit = 20,
}: {
  page: number;
  limit: number;
}) {
  const db = await PatientDatabase.getInstance();

  const offset = calculateOffset({ page, limit });

  const result = await db.query(getAllPatientsReadQuery, [limit, offset]);

  return result.rows;
}
