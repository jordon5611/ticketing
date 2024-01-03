import express, { Request, Response, NextFunction, response } from "express";
import { body } from "express-validator";
import { requireUser, validator, TicketCreatedInterface } from "@jordonticketing/common";
import { Tickets } from "../models/Tickets";
import { natsWrapper } from "../natsWrapper";
import { TicketCreatedPublisher } from "../events/publisher-events/TicketCreated-publisher";

const router = express.Router();

router.post(
  "/api/tickets/create",
  requireUser,
  [
    body("title").not().notEmpty().withMessage("Title must be valid"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validator,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const TicketsCreated = Tickets.build({
      title,
      price,
      userId: req.currentUser?.id!,
    });

    await TicketsCreated.save();

    const TicketCreatedEvent = new TicketCreatedPublisher(natsWrapper.client)
    
    await TicketCreatedEvent.publish({
      id: TicketsCreated.id,
      title: TicketsCreated.title,
      userId: TicketsCreated.userId,
      price: TicketsCreated.price,
      version: TicketsCreated.version
    }) 

    res.status(200).send(TicketsCreated);
  }
);

export { router as createTickets };
