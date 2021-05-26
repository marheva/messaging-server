import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { errorHandler } from "../helpers/dbErrorHandlers";
import UserInterface from "../interfaces/user";

const BT_SALT_ROUNDS = 12;

export const getIsAuth = (req: Request & any, res: Response, next: NextFunction): void => {
  const isAuth = req.session.isLoggedIn;
  if (!isAuth) {
    res.status(403).json({ error: true, message: "Access denied." });
    return;
  }
  next();
};
export const getSession = (req: Request & any, res: Response, next: NextFunction): void => {
  const isAuth = req.session.isLoggedIn;
  if (!isAuth) {
    res.status(403).json({ error: true, message: "Access denied." });
    return;
  }
  req.session.user.password = "secret";
  res.status(200).json({ error: false, message: "Session is active.", additional: req.session.user });
};

export const postUserSignup = (req: Request, res: Response): void => {
  const { name, email, password, role, confirmPassword } = req.body;
  User.findOne({ email: email }).then((userDocument) => {
    if (userDocument) {
      res.status(409).json({ error: true, message: "Email already exist." });
      return;
    }
    return bcrypt.hash(password, BT_SALT_ROUNDS).then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      user.save((error, user: UserInterface) => {
        if (error) {
          return res.status(500).json({
            error: true,
            message: errorHandler(error),
          });
        }
        res.status(201).json({ error: false, message: "User created success.", additional: user });
      });
    });
  });
};

export const postUserLogin = (req: Request & any, res: Response): void => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found." });
    }
    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(() =>
          res.status(202).json({ error: false, message: "User login success.", additional: user._id })
        );
      }
      res.status(401).json({ error: true, message: "Unauthorized user.", additional: false });
    });
  });
};

export const postUserLogout = (req: Request & any, res: Response) => {
  req.session.destroy(() => {
    res.status(200).json({ error: false, message: "Logout user." });
  });
};
