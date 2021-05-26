import { Router } from "express";

const router = Router();

const {
  readCategoryById,
  getCategories,
  findCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/category");
const { getIsAuth } = require("../controllers/auth");
const { findUserById } = require("../controllers/user");

router.get("/category/:categoryId", readCategoryById);
router.get("/categories", getCategories);
router.post("/category/create/:userId", getIsAuth, createCategory);
router.put("/category/update/:categoryId/:userId", getIsAuth, updateCategoryById);
router.delete("/category/delete/:categoryId/:userId", getIsAuth, deleteCategoryById);

router.param("userId", findUserById);
router.param("categoryId", findCategoryById);

export default router;
