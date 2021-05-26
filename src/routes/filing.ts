import { Router } from "express";

const { getIsAuth } = require("../controllers/auth");
const { findUserById } = require("../controllers/user");
const { getFilesList, uploadFile, deleteFile } = require("../controllers/filing");

const router = Router();

router.get("/filing/files/:userId", getIsAuth, getFilesList);

// TODO: add query par. csv | pdf | txt | ...
router.post("/filing/upload/:userId", getIsAuth, uploadFile);

// TODO: add query par. csv | pdf | txt | ...
router.delete("/filing/delete/:userId", getIsAuth, deleteFile);
router.param("userId", findUserById);

export default router;
