import { z } from "zod";

const forbiddenKeywords = [
  "insert",
  "update",
  "delete",
  "merge",
  "upsert",
  "drop",
  "alter",
  "create",
  "truncate",
  "rename",
  "grant",
  "revoke",
  "commit",
  "rollback",
  "savepoint",
  "exec",
  "execute",
  "call",
  "perform",
  "do",
  "copy",
  "vacuum",
  "analyze",
  "reindex",
  "cluster",
  "listen",
  "notify",
  "unlisten",
  "load",
  "reset",
  "pg_cancel_backend",
  "pg_terminate_backend",
  "pg_reload_conf",
  "pg_rotate_logfile",
  "pg_switch_wal",
  "pg_create_restore_point",
];

const dangerousFunctionPatterns = [
  /\bpg_exec\s*\(/i,
  /\bdblink\w*\s*\(/i,
  /\bpg_read_file\s*\(/i,
  /\bpg_write_file\s*\(/i,
  /\bpg_ls_dir\s*\(/i,
  /\bpg_stat_file\s*\(/i,
  /\blo_import\s*\(/i,
  /\blo_export\s*\(/i,
  /\bcurrval\s*\(/i,
  /\bnextval\s*\(/i,
  /\bsetval\s*\(/i,
];

const suspiciousPatterns = [
  /;\s*(insert|update|delete|drop|alter|create)/i,
  /\bunion\s+select.*?(insert|update|delete)/i,
  /\binto\s+outfile\b/i,
  /\bload_file\s*\(/i,
  /\b(--|#|\/\*).*?(insert|update|delete|drop)/i,
];

export const RawSQLQuerySchema = z.object({
  rawInput: z
    .string()
    .min(1, "Query input must be a non-empty string")
    .trim()
    .refine(
      (query) => {
        const trimmed = query.replace(/;+$/, "").trim();

        if (!/^\s*(\/\*.*?\*\/)?\s*select\s/i.test(trimmed)) return false;

        for (const keyword of forbiddenKeywords) {
          if (new RegExp(`\\b${keyword}\\b`, "i").test(trimmed)) return false;
        }

        for (const pattern of dangerousFunctionPatterns) {
          if (pattern.test(trimmed)) return false;
        }

        for (const pattern of suspiciousPatterns) {
          if (pattern.test(trimmed)) return false;
        }

        const ctePattern =
          /\bwith\s+\w+\s+as\s*\([^)]*?(insert|update|delete|drop|alter|create)[^)]*?\)/i;
        if (ctePattern.test(trimmed)) return false;

        const nestedMutationPattern =
          /\(\s*select[^)]*?(insert|update|delete|drop|alter|create)[^)]*?\)/i;
        if (nestedMutationPattern.test(trimmed)) return false;

        if (trimmed.length > 10000) return false;

        let parenDepth = 0;
        let maxDepth = 0;
        for (const char of trimmed) {
          if (char === "(") parenDepth++;
          if (char === ")") parenDepth--;
          maxDepth = Math.max(maxDepth, parenDepth);
        }

        if (maxDepth > 20) return false;

        return true;
      },
      {
        message: "Query is unsafe or invalid.",
      }
    ),
});

export type RawSQLQueryInput = z.infer<typeof RawSQLQuerySchema>;
