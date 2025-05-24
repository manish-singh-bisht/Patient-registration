import { z } from "zod";

export const PaginationSchema = z.object({
  currentPage: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

export type PaginationType = z.infer<typeof PaginationSchema>;
