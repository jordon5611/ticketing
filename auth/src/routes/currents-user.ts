import express from "express";
import jwt from "jsonwebtoken";
import { Verify } from "@jordonticketing/common";
const router = express.Router();

interface Decoded {
  email: string;
  id: string;
}

router.get("/api/users/currentuser", Verify, (req, res) => {
  const UserData = req.currentUser;
  res.status(200).send(UserData);
});

export { router as CurrentUser };
