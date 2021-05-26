import { Request, Response } from "express";
import _ from "lodash";
import csvtojson from "csvtojson";
import path from "path";
import { errorHandler } from "../helpers/dbErrorHandlers";
import UploadedContact from "../models/uploadedContact";

const GET_CONTACTS_LIMIT_SIZE = 50;

export const createUploadedContacts = (req: Request | any, res: Response): void => {
  const { _id } = req.profile;
  const { fileName } = req.body;
  const dirname = path.resolve("./public/csv");
  const filepath = `${dirname}/${fileName}`;

  csvtojson()
    .fromFile(filepath)
    .then((csvData) => {
      UploadedContact.collection.insertMany(csvData, (error, documents) => {
        if (error) return res.status(500).json({ error: true, message: errorHandler(error) });
        return res.status(201).json({ error: false, message: "Contacts was processed." });
      });
    });
};

export const getUploadedContactList = (req: Request | any, res: Response): void => {
  const limit = req.query.limit ? parseInt(req.query.limit) : GET_CONTACTS_LIMIT_SIZE;
  UploadedContact.find()
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
