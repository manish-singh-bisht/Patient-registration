import { z } from "zod";
import { calculateOffset } from "../../../utils";
import { PatientDatabase } from "../../init-pglite-instance";
import {
  getAllPatientsReadQuery,
  getTotalPatientsCountQuery,
} from "../../queries/reads/patients/get-many";
import {
  GetAllPatientsInputSchema,
  PaginatedPatientsResultSchema,
  PatientReturnDataSchema,
  type GetAllPatientsInput,
  type PaginatedPatientsResult,
} from "../types/patient/get-all-patient";

export async function getAllPatients({
  input,
}: {
  input: GetAllPatientsInput;
}): Promise<PaginatedPatientsResult> {
  const parsed = GetAllPatientsInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(
      `Invalid pagination params: ${JSON.stringify(parsed.error.format())}`
    );
  }

  const { page, limit } = parsed.data;

  const db = await PatientDatabase.getInstance();
  const offset = calculateOffset({ page, limit });

  const [patientsResult, countResult] = await Promise.all([
    db.query(getAllPatientsReadQuery, [limit, offset]),
    db.query<{
      total_count: string;
    }>(getTotalPatientsCountQuery),
  ]);

  // using zod to parse because the data is still local and thus mutable
  // this will prevent the frontend from breaking
  const patientsParseResult = z
    .array(PatientReturnDataSchema)
    .safeParse(patientsResult.rows);

  if (!patientsParseResult.success) {
    throw new Error(
      `Invalid patient data: ${JSON.stringify(
        patientsParseResult.error.format()
      )}`
    );
  }
  const patients = patientsParseResult.data;

  const totalCountRaw = countResult.rows[0].total_count;
  const totalCount =
    totalCountRaw !== undefined ? parseInt(totalCountRaw, 10) : 0;

  if (isNaN(totalCount)) throw new Error("Invalid totalCount from DB");

  const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / limit);
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const resultParseResult = PaginatedPatientsResultSchema.safeParse({
    patients,
    pagination: {
      currentPage,
      totalCount,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  });
  if (!resultParseResult.success) {
    throw new Error(
      `Invalid paginated result data: ${JSON.stringify(
        resultParseResult.error.format()
      )}`
    );
  }

  const result = resultParseResult.data;

  return result;
}
