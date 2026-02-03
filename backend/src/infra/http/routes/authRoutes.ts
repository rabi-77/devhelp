import { Router } from "express";
import { container } from "../../container/inversify.container";
import { validateRequest } from "../middlewares/validateRequest";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../../../shared/validation/authSchemas";
import { Types } from "../../container/types";
import { AuthController } from "../controllers/auth/AuthController";
import { InviteController } from "../controllers/invite/InviteController";
import {
  forgotPasswordIpLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../middlewares/rateLimiter";

const router = Router();

const authController = container.get<AuthController>(Types.AuthController);
const inviteController = container.get<InviteController>(
  Types.InviteController,
);

router.post("/signup", validateRequest(signupSchema), authController.signup);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/validate-invite", inviteController.verifyToken);
router.post("/accept-invitation", inviteController.acceptInvite);

router.post(
  "/forgot-password",
  forgotPasswordIpLimiter,
  validateRequest(forgotPasswordSchema),
  forgotPasswordLimiter,
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  resetPasswordLimiter,
  validateRequest(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
