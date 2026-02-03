import { Router } from "express";
import { container } from "../../container/inversify.container";
import { Types } from "../../container/types";
import { InviteController } from "../controllers/invite/InviteController";
import { validateRequest } from "../middlewares/validateRequest";
import { sendCompanyInviteSchema } from "../../../shared/validation/inviteSchema";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

const inviteController = container.get<InviteController>(
  Types.InviteController,
);

router.use(authenticate);

router.post(
  "/members/invite",
  validateRequest(sendCompanyInviteSchema),
  inviteController.sendCompanyInvite,
);

export default router;
