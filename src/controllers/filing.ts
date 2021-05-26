import { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import { multerUpload } from "../helpers/multerStorage";

export const uploadFile = (req: Request | any, res: Response) => {
  multerUpload(req, res, function (err: any) {
    const {
      file: { originalname },
    } = req || {};
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: true, message: `File was not uploaded.` });
    } else if (err) {
      return res.status(500).json({ error: true, message: `File was not uploaded.` });
    }
    return res.status(200).json({ error: false, message: `${originalname} was uploaded.`, additional: originalname });
  });
};

export const getFilesList = (req: Request | any, res: Response) => {
  const isCSV = !!req.query?.fileType;
  // TODO:
  const dirname = path.resolve("./public/csv");
  const files = fs.readdirSync(dirname);
  return res.status(200).json({ error: false, message: `Files.`, additional: files });
};

export const deleteFile = (req: Request | any, res: Response) => {
  const { fileName } = req.body;
  const dirname = path.resolve("./public/csv");
  const files = fs.readdirSync(dirname);
  if (files.includes(fileName)) {
    return fs.unlink(`${dirname}/${fileName}`, (error) => {
      if (error) {
        return res.status(500).json({ error: true, message: "Failed to delete file" });
      }
      return res.status(200).json({ error: false, message: `${fileName} was deleted.` });
    });
  }
  res.status(404).json({ error: true, message: "File does not exist." });
};
