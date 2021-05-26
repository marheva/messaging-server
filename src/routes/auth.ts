import { Router } from "express";

const router = Router();

const { getSession, postUserSignup, postUserLogin, postUserLogout } = require("../controllers/auth");

router.get("/session", getSession);
router.post("/signup", postUserSignup);
router.post("/login", postUserLogin);
router.post("/logout", postUserLogout);

export default router;
