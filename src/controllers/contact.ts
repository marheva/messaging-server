import { NextFunction, Request, Response } from "express";
import Formidable, { Fields } from "formidable";
import formidable from "formidable";
import _ from "lodash";
import { errorHandler } from "../helpers/dbErrorHandlers";
import ContactInterface from "../interfaces/contact";
import Contact from "../models/contact";

const GET_CONTACTS_LIMIT_SIZE = 6;
const GET_RELATED_CONTACTS_LIMIT_SIZE = 6;

interface FormidableTypes extends Formidable {
  keepExtensions?: boolean;
}

export const readContactById = (req: Request | any, res: Response) => {
  return res.status(200).json({ error: false, message: "Contact was found.", additional: req.contact });
};

export const findContactById = (req: Request | any, res: Response, next: NextFunction, id: string): void => {
  Contact.findById(id).exec((err, contact) => {
    if (err || !contact) {
      return res.status(404).json({ error: true, message: "Contact does not exist." });
    }
    req.contact = contact;
    next();
  });
};

export const createContact = (req: Request | any, res: Response): void => {
  let form: FormidableTypes = new formidable.IncomingForm();
  const { _id } = req.profile;

  form.parse(req, (err, fields) => {
    let contact: any = new Contact({ ...fields, customerId: _id });
    const { first_name, phone } = fields;
    if (!first_name || !phone) {
      return res.status(400).json({ error: true, message: "All fields are required." });
    }

    contact.save((err: any, contact: any) => {
      if (err) {
        return res.status(500).json({ error: true, message: errorHandler(err) });
      }
      return res.status(201).json({ error: false, message: "Contact was created.", additional: contact });
    });
  });
  return;
};

export const removeContactById = (req: Request | any, res: Response): void => {
  const contact = req.contact;
  contact.remove((err: Error, deletedContact: ContactInterface) => {
    if (err) {
      return res.status(500).json({ error: true, message: errorHandler(err) });
    }
    res.status(200).json({ error: false, message: "Contact deleted successfully!", additional: deletedContact });
  });
};

export const updateContactById = (req: Request | any, res: Response): void => {
  let form: FormidableTypes = new formidable.IncomingForm();

  form.parse(req, (err, fields) => {
    let contact: ContactInterface & Fields = req.contact;
    contact = _.extend(contact, fields);
    contact.save((err) => {
      if (err) {
        return res.status(500).json({ error: true, message: errorHandler(err) });
      }
      res.status(200).json({ error: false, message: "Contact was updated." });
    });
  });
};

// for admin or adminpanel => all contacts => all customers
//
export const getContactList = (req: Request | any, res: Response): void => {
  const limit = req.query.limit ? parseInt(req.query.limit) : GET_CONTACTS_LIMIT_SIZE;
  Contact.find()
    .populate("category")
    .limit(limit)
    .exec((error, contact) => {
      if (error) {
        return res.status(404).json({
          error: true,
          message: "Contacts not found.",
        });
      }
      res.status(200).json({ error: false, message: "Contacts list fetched.", additional: contact });
    });
};

export const getUserContactList = (req: Request | any, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : GET_CONTACTS_LIMIT_SIZE;
  const { _id } = req.profile;
  Contact.find({ customerId: _id })
    .populate("category")
    .limit(limit)
    .exec((error, contact) => {
      if (error) {
        return res.status(404).json({
          error: true,
          message: "Contacts not found.",
        });
      }
      res.status(200).json({ error: false, message: "Contacts list fetched.", additional: contact });
    });
};

// * it will find the contacts based on the req contact category;
// * other contacts that has the same category, will be returned;
// ** $ne => not included => for example => all related contacts without itself contact;

export const getRelatedContactList = (req: Request | any, res: Response): void => {
  const limit = req.query.limit ? parseInt(req.query.limit) : GET_RELATED_CONTACTS_LIMIT_SIZE;

  Contact.find({ _id: { $ne: req.contact }, category: req.contact.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((error, relatedContacts) => {
      if (error) {
        return res.status(404).json({ error: true, message: "Related contacts not found." });
      }
      res.status(200).json({ error: false, message: "Related contacts list fetched.", additional: relatedContacts });
    });
};
// * distinct => we want to get all categories that are used in the contact more distinct to contact,
//   categories are used for contacts;
// * {} => you can past **queries;
//
export const getContactCategoriesList = (req: Request | any, res: Response): void => {
  Contact.distinct("category", {}, (error, categories) => {
    if (error) {
      return res.status(404).json({ error: true, message: "Categories not found." });
    }
    res.status(200).json({ error: false, message: "Categories list fetched.", additional: categories });
  });
};
