import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { validator } from "@jordonticketing/common";
import { User } from "../model/user";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4-20"),
  ],
  validator,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const Created = User.build({ email, password });
    await Created.save();

    const token = jwt.sign(
      { id: Created.id, email: Created.email },
      process.env.JWT_KEY!,
      {
        expiresIn: "60m",
      }
    );

    const show = {
      id: Created._id,
      email: Created.email,
      token: token,
    };

    res.status(201).send(show);
  }
);

export { router as SignUp };
