import express from "express";
import { Tickets } from "../models/Tickets";
import { requireUser } from "@jordonticketing/common";

const router = express.Router();

router.get("/api/tickets", requireUser, async (req, res) => {
  const Ticket = await Tickets.find({});

  res.status(200).json(Ticket);
});

export { router as ShowAll };
