import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import _ from "lodash";
import Formidable, { Fields } from "formidable";
import formidable from "formidable";
import { errorHandler } from "../helpers/dbErrorHandlers";
import Messaging from "../models/messaging";
import MessagingInterface from "../interfaces/messaging";
import { Twilio } from "twilio";

const BT_SALT_ROUNDS = 12;

interface FormidableTypes extends Formidable {}

export const readMessagingItemById = (req: Request | any, res: Response) => {
  return res.status(200).json({ error: false, message: "Messaging item was found.", additional: req.messaging.name });
};

export const findMessagingItemById = (req: Request | any, res: Response, next: NextFunction, id: string): void => {
  Messaging.findById(id).exec((err, messaging) => {
    if (err || !messaging) {
      return res.status(404).json({ error: true, message: "Messaging item does not exist." });
    }
    req.messaging = messaging;
    next();
  });
};

export const postCreateMessaging = (req: Request | any, res: Response, next: NextFunction): void => {
  let form: FormidableTypes = new formidable.IncomingForm();
  const { _id } = req.profile;

  form.parse(req, (err, fields) => {
    const { name, sid, authToken, numberFrom, numberTo } = fields;
    if (!name || !sid || !authToken) {
      return res.status(400).json({ error: true, message: "All fields are required." });
    }
    Messaging.find().then((messagingDocument) => {
      // if (messagingDocument) {
      //   res.status(409).json({ error: true, message: `Messaging type ${name} already exist.` });
      //   return;
      // }

      const messaging = new Messaging({
        name: name,
        sid: sid,
        authToken: authToken,
        numberFrom: numberFrom,
        numberTo: numberTo,
        user: _id,
      });
      messaging.save((error, messaging: MessagingInterface) => {
        if (error) {
          return res.status(500).json({
            error: true,
            message: errorHandler(error),
          });
        }
        return res.status(201).json({ error: false, message: `Messaging type ${messaging.name} created success.` });
      });
    });
  });
};

export const postSendNotification = (req: Request | any, res: Response, next: NextFunction): any => {
  const { sid, authToken, numberFrom, numberTo } = req.messaging;
  if (!sid || !authToken || !numberFrom || !numberTo) {
    return res
      .status(400)
      .json({ error: true, message: "You are missing one of the variables you need to send a message." });
  }
  // have to add from const
  //
  const client = new Twilio("ACbc898bbb4fc0d9f7801803b15bc53276", "493145946a3ef1e392e2a3f96d5dcee7");
  client.messages
    .create({
      body: "Hello from Node",
      to: numberTo,
      from: numberFrom,
    })
    .then((message) => {
      if (message) {
        return res.status(200).json({ error: false, message: `Notification was sended.` });
      }
    });
};
