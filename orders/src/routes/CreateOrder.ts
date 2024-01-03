import express, {Request, Response} from "express";
import mongoose from "mongoose";
import { requireUser, validator, OrderStatus,NotFoundError, BadRequest } from "@jordonticketing/common";
import { body } from "express-validator";
import { Orders } from "../model/order";
import { Ticket } from "../model/ticket";
import { OrderCreatedPublisher } from "../events/publisher/orderCreated-publisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router()

router.post('/api/orders', requireUser,[ body('TicketId').notEmpty().custom((item: string) => mongoose.isValidObjectId(item)).not().withMessage('TicketId should be valid')],
validator, async(req: Request, res: Response)=>{
    const {TicketId} = req.body

    //First Find the Ticket from the DB
    const ticket = await Ticket.findById(TicketId)
    if(!ticket){
        throw new NotFoundError('Ticket Not Found')
    }
    //Make sure the ticket is not already Reserved
    const OrderIsReserved = await ticket.isReserved()

    if(OrderIsReserved){
        throw new BadRequest('Ticket is reserved')
    }

    //Setting Expiration Time
    const expiration = new Date()
    expiration.setMinutes(expiration.getMinutes() + 1)

    //build a order and save it to DB
    const order = await Orders.build({
        userId: req.currentUser?.id!,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    })

    await order.save()

    //Publish Order-created

    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        userId: order.userId,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {id: ticket.id, price: ticket.price},
        version: order.version
    })

    res.status(201).send(order)
})

export {router as CreateOrder}