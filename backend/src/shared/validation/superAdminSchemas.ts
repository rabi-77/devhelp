import { z } from "zod";

export const superAdminLoginSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type superAdminLoginInput = z.infer<typeof superAdminLoginSchema>;

export const getAllCompaniesSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  search: z.string().optional().default(""),
  status: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["active", "inactive", "trial", "suspended", "deleted"]).optional()
  ),
  sortBy: z
    .enum(["name", "createdAt", "lastActive"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
export type getAllCompaniesInput = z.infer<typeof getAllCompaniesSchema>;
