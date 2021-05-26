import { Router } from "express";
import {
  findMessagingItemById,
  postCreateMessaging,
  readMessagingItemById,
  postSendNotification,
} from "../controllers/messaging";

const router = Router();

const { getIsAuth } = require("../controllers/auth");
const { findUserById } = require("../controllers/user");

router.get("/messaging/:messagingId/:userId", getIsAuth, readMessagingItemById);
router.post("/messaging/create/:userId", getIsAuth, postCreateMessaging);
router.post("/messaging/notification/:messagingId/:userId", getIsAuth, postSendNotification);

router.param("userId", findUserById);
router.param("messagingId", findMessagingItemById);

export default router;
