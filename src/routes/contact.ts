import { Router } from "express";

const router = Router();

const {
  getContactList,
  getRelatedContactList,
  getContactCategoriesList,
  createContact,
  findContactById,
  readContactById,
  removeContactById,
  updateContactById,
  getUserContactList,
} = require("../controllers/contact");
const { getIsAuth } = require("../controllers/auth");
const { findUserById } = require("../controllers/user");

router.get("/contact/:contactId", readContactById);
router.get("/contacts", getContactList);
router.get("/contacts/:userId", getUserContactList);

router.get("/contacts/related/:contactId", getRelatedContactList);
router.get("/contacts/categories", getContactCategoriesList);

router.post("/contact/create/:userId", getIsAuth, createContact);
router.delete("/contact/delete/:contactId/:userId", getIsAuth, removeContactById);
router.put("/contact/update/:contactId/:userId", getIsAuth, updateContactById);

router.param("userId", findUserById);
router.param("contactId", findContactById);

export default router;
