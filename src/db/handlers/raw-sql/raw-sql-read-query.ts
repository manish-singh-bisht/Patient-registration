import { PatientDatabase } from "../../init-pglite-instance";
import {
  RawSQLQuerySchema,
  type RawSQLQueryInput,
} from "../types/raw-sql/type";

export async function runRawSQLReadQuery({
  input,
}: {
  input: RawSQLQueryInput;
}) {
  const result = RawSQLQuerySchema.safeParse(input);

  if (!result.success) {
    throw new Error(result.error.errors.map((e) => e.message).join("; "));
  }

  const db = await PatientDatabase.getInstance();
  let query = result.data.trim().replace(/;+$/, "");

  const maxDefaultLimit = 1000;
  const hasLimit = /\blimit\s+\d+/i.test(query);

  if (hasLimit) {
    const match = query.match(/\blimit\s+(\d+)/i);
    if (match && parseInt(match[1], 10) > 10000) {
      throw new Error("LIMIT value is too large. Maximum allowed is 10000.");
    }
  } else {
    query = `${query} LIMIT ${maxDefaultLimit}`;
  }

  const statementCount = query.split(";").filter((q) => q.trim()).length;
  if (statementCount > 1) {
    throw new Error("Multiple SQL statements are not allowed.");
  }

  try {
    const result = await db.query(query);
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (
        err.message.includes("syntax error") ||
        err.message.includes("column") ||
        err.message.includes("table")
      ) {
        throw new Error("Invalid SQL syntax or database structure reference.");
      }

      throw new Error(`Query execution failed: ${err.message}`);
    }

    throw new Error("An unexpected error occurred while executing the query.");
  }
}
