import express, { Response, Request } from "express";
import { body, validationResult } from "express-validator";
import { validator, BadRequest } from "@jordonticketing/common";
import { User } from "../model/user";
import { ComparePassword } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email should be valid"),
    body("password")
      .trim()
      .notEmpty()
      .isLength({ max: 20, min: 4 })
      .withMessage("Password must be valid"),
  ],
  validator,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequest("Email is not Created");
    }

    const isPasswordCorrect = await ComparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequest("Password is incorrect");
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!,
      {
        expiresIn: "60m",
      }
    );

    const show = {
      id: user._id,
      email: user.email,
      token: token,
    };

    res.status(200).send(show);
  }
);

export { router as SignIn };
