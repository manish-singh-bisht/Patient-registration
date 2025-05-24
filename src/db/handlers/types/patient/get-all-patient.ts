import { z } from "zod";

export const GetAllPatientsInputSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type GetAllPatientsInput = z.infer<typeof GetAllPatientsInputSchema>;
