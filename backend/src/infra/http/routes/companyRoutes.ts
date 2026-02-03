import { Router } from "express";
import { container } from "../../container/inversify.container";
import { CompanyUserController } from "../controllers/company/CompanyUserController";
import { Types } from "../../container/types";
import { requireAuth } from "../middlewares/authenticate";
import { requireAdmin } from '../middlewares/authenticateAdmin'
import { validateRequest } from "../middlewares/validateRequest";
import { z } from "zod";

const router = Router();

const companyUserController = container.get<CompanyUserController>(
    Types.CompanyUserController,
);

const updateUserStatusSchema = z.object({
    status: z.enum(["active", "blocked"]),
});

router.get(
    "/users",
    requireAuth,
    // requireAdmin, // Optionally enforce admin role
    companyUserController.getUsers,
);

router.patch(
    "/users/:id/status",
    requireAuth,
    requireAdmin,
    validateRequest(updateUserStatusSchema),
    companyUserController.updateUserStatus,
);

export default router;
