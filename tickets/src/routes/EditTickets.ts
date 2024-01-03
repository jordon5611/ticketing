import express, { Request, Response } from "express";
import { Tickets } from "../models/Tickets";
import {
  validator,
  requireUser,
  BadRequest,
  NotFoundError,
} from "@jordonticketing/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { natsWrapper } from "../natsWrapper";
import { TicketUpdatedPublisher } from "../events/publisher-events/TicketUpdated-publisher";

const Router = express.Router();

Router.patch(
  "/api/tickets/:id",
  requireUser,
  [
    body("title").not().notEmpty().withMessage("Title should be valid"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price should be greater than zero"),
  ],
  validator,
  async (req: Request, res: Response) => {
    const ValidId = mongoose.isValidObjectId(req.params.id);
    if (!ValidId) {
      throw new BadRequest("Id is not Valid");
    }
    const { title, price } = req.body;

    const Ticket = await Tickets.findById(req.params.id);
    if (!Ticket) {
      throw new BadRequest("No ticket by this Id");
    }
    if(Ticket.orderId){
      throw new BadRequest("Ticket is Reserved , So Cant Edit now");
      
    }

    if (Ticket.userId !== req.currentUser?.id) {
      throw new BadRequest("Not Authorized");
    }

    Ticket.set({
      title: title,
      price: price,
    });

    await Ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: Ticket.id,
      title: Ticket.title,
      price: Ticket.price,
      userId: Ticket.userId,
      version: Ticket.version
    })


    res.status(200).json(Ticket);
  }
);

export { Router as EditTickets };
