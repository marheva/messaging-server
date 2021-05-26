import { NextFunction, Request, Response } from "express";

import Category from "../models/category";
import { errorHandler } from "../helpers/dbErrorHandlers";
import CategoryInterface from "../interfaces/category";

export const findCategoryById = (req: Request | any, res: Response, next: NextFunction, id: string) => {
  Category.findById(id).exec((error, category) => {
    if (error || !category) {
      return res.status(404).json({
        error: true,
        message: "Category does not exist.",
      });
    }
    req.category = category;
    next();
  });
};

export const readCategoryById = (req: Request | any, res: Response) => {
  return res.status(201).json({ error: false, message: "Category was found.", additional: req.category });
};

export const createCategory = (req: Request | any, res: Response) => {
  const { name } = req.body;
  Category.findOne({ name: name }).then((categoryDocument) => {
    if (categoryDocument) {
      res.status(403).json({ error: true, message: "Category exist." });
      return;
    }
    const category = new Category({ name: name });
    category.save((error, category: CategoryInterface) => {
      if (error) {
        return res.status(400).json({
          error: true,
          message: errorHandler(error),
        });
      }
      res.status(201).json({ error: false, message: "Category created success.", additional: category });
    });
  });
};

export const getCategories = (req: Request | any, res: Response) => {
  Category.find().exec((error, categoriesList) => {
    if (error) {
      return res.status(400).json({ error: true, message: "Categories were not found." });
    }
    res.status(200).json({ error: false, message: "Categories were found.", additional: categoriesList });
  });
};

export const updateCategoryById = (req: Request | any, res: Response) => {
  const category: CategoryInterface = req.category;
  category.name = req.body.name;

  category.save((error, updatedCategory) => {
    if (error) {
      return res.status(400).json({ error: true, message: "Category could not be uploaded." });
    }
    res.status(200).json({ error: false, message: "Category was updated.", additional: updatedCategory });
  });
};

export const deleteCategoryById = (req: Request | any, res: Response) => {
  const category: CategoryInterface | any = req.category;

  category.remove((error: Error, deletedCategory: CategoryInterface) => {
    if (error) {
      return res.status(400).json({ error: true, message: "Category could not be removed." });
    }
    res.status(200).json({ error: false, message: "Category was deleted.", additional: deletedCategory });
  });
};
