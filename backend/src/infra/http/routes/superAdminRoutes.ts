import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import {
  getAllCompaniesSchema,
  superAdminLoginSchema,
} from "../../../shared/validation/superAdminSchemas";
import { superAdminLoginLimiter } from "../middlewares/rateLimiter";
import { container } from "../../container/inversify.container";
import { SuperAdminController } from "../controllers/super-admin/SuperAdminController";
import { Types } from "../../container/types";
import { requireAuth } from "../middlewares/authenticate";
import { requireSuperAdmin } from "../middlewares/authenticateSuper_admin";

const router = Router();

let superAdminController = container.get<SuperAdminController>(
  Types.SuperAdminController,
);

router.post(
  "/login",
  superAdminLoginLimiter,
  validateRequest(superAdminLoginSchema),
  superAdminController.loginSuperAdmin,
);

router.get(
  "/companies",
  requireAuth,
  requireSuperAdmin,
  validateRequest(getAllCompaniesSchema),
  superAdminController.getAllCompanies,
);

router.get(
  "/companies/:id",
  requireAuth,
  requireSuperAdmin,
  superAdminController.getCompany,
);

router.patch(
  "/companies/:id/status",
  requireAuth,
  requireSuperAdmin,
  superAdminController.updateCompanyStatus,
);

export default router;
