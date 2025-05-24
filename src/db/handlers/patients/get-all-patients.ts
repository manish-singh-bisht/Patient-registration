import { z } from "zod";
import { calculateOffset } from "../../../utils";
import { PatientDatabase } from "../../init-pglite-instance";
import { getAllPatientsReadQuery } from "../../queries/reads/patients/get-many";

export const GetAllPatientsInputSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type GetAllPatientsInput = z.infer<typeof GetAllPatientsInputSchema>;

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
