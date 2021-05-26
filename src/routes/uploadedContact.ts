import { Router } from "express";
import { getUploadedContactList, createUploadedContacts } from "../controllers/uploadedContact";
const router = Router();

const { getIsAuth } = require("../controllers/auth");
const { findUserById } = require("../controllers/user");

router.get("/uploaded/contacts", getUploadedContactList);

router.post("/uploaded/contacts/:userId", getIsAuth, createUploadedContacts);
router.param("userId", findUserById);

export default router;
