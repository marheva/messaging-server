import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user";
import Messaging from "../models/messaging";
import { errorHandler } from "../helpers/dbErrorHandlers";
import UserInterface from "../interfaces/user";

const BT_SALT_ROUNDS = 12;
const USER_EXPIRATION_TIME = 3600000;
const CRYPTO_RANDOM_BITES_LENGTH = 32;

export const findUserById = (req: Request | any, res: Response, next: NextFunction, id: string): void => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: true,
        message: "User not found.",
      });
    }
    req.profile = user;
    next();
  });
};

export const readUserById = (req: Request | any, res: Response) => {
  // findUserById => middleware => always run
  //
  req.profile.password = undefined;
  return res.status(200).json({
    error: false,
    message: "User found.",
    additional: req.profile,
  });
};

export const updateUserById = (req: Request | any, res: Response) => {
  // $set => new updated body, set all from request
  //
  User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (error, updatedUser) => {
    if (error || !updatedUser) {
      return res.status(403).json({ error: true, message: "You are not authorized to perform this action." });
    }
    (updatedUser as any).password = undefined;
    res.status(200).json({ error: false, message: "User was updated.", additional: updatedUser });
  });
};
export const updateUserMessaging = (req: Request | any, res: Response, next: NextFunction): any => {
  const { _id } = req.profile;

  if (!_id) {
    return res.status(403).json({ error: true, message: "You are not authorized to perform this action." });
  }

  Messaging.find({ user: _id }).exec((error, messaging: any) => {
    if (error) {
      return res.status(404).json({
        error: true,
        message: "Messaging type not found.",
      });
    }

    User.findOneAndUpdate(
      { _id: _id },
      { $set: { messaging: { items: messaging } } },
      { new: true },
      (error, updatedUser) => {
        if (error || !updatedUser) {
          return res.status(403).json({ error: true, message: "You are not authorized to perform this action." });
        }
        res.status(200).json({ error: false, message: "User messaging was updated." });
      }
    );
  });
};

export const postUserResetPassword = (req: Request | any, res: Response): void => {
  crypto.randomBytes(CRYPTO_RANDOM_BITES_LENGTH, (error, buffer) => {
    if (error) {
      return res.status(500).json({
        error: true,
        message: errorHandler(error),
      });
    }
    const { email } = req.body;
    const token = buffer.toString("hex");

    User.findOne({
      email: email,
    })
      .then((user: UserInterface | any) => {
        if (!user) {
          return res.status(404).json({ error: true, message: "User not found." });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + USER_EXPIRATION_TIME;

        return user.save();
      })
      .then(() => {
        res.status(200).json({ error: false, message: `Reset token ${token}`, additional: { resetToken: token } });
      })
      .catch((error) => {
        return res.status(500).json({
          error: true,
          message: errorHandler(error),
        });
      });
  });
};

export const postUserNewPassword = (req: Request | any, res: Response): void => {
  const { password, userId, passwordToken } = req.body;
  const newPassword = password;
  let resetUser: UserInterface | any;
  User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() as any }, _id: userId })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, BT_SALT_ROUNDS);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.status(200).json({ error: false, message: `Password was reset. ` });
    })
    .catch((error) => {
      const err = new Error(error);
      return res.status(500).json({
        error: true,
        message: errorHandler(error),
      });
    });
};
