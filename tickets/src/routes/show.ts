import express, { Request, Response } from "express";
import { BadRequest } from "@jordonticketing/common";
import { Tickets } from "../models/Tickets";
import mongoose from "mongoose";

const router = express.Router();

router.get("/api/tickets/:id", async (req, res) => {
  const IsValid = mongoose.isValidObjectId(req.params.id);
  if (!IsValid) {
    throw new BadRequest("Id is not Valid");
  }

  const TicketbyUser = await Tickets.findById(req.params.id);

  if (!TicketbyUser) {
    throw new BadRequest("Not found ticket by this user");
  }

  res.status(200).send(TicketbyUser);
});

export { router as show };
