import { Router } from "express";

const router = Router();

const { getIsAuth } = require("../controllers/auth");
const {
  readUserById,
  updateUserById,
  findUserById,
  postUserResetPassword,
  postUserNewPassword,
  updateUserMessaging,
} = require("../controllers/user");

router.get("/secret/:userId", getIsAuth, (req: any, res) => {
  res.json({
    user: req.profile,
  });
});

router.get("/user/:userId", getIsAuth, readUserById);
router.put("/user/update/:userId", getIsAuth, updateUserById);
router.put("/user/messaging/update/:userId", getIsAuth, updateUserMessaging);
router.post("/reset", getIsAuth, postUserResetPassword);
router.post("/new-password", getIsAuth, postUserNewPassword);

router.param("userId", findUserById);

export default router;
