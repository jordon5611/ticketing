import { NotFoundError, OrderStatus, UnAuthorizedError, requireUser, validator } from "@jordonticketing/common";
import express, {Request, Response} from "express";
import mongoose from "mongoose";
import { Orders } from "../model/order";
import { param } from "express-validator";
import { OrderCancelledPublisher } from "../events/publisher/orderCancelled-publisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router()

router.delete('/api/orders/:orderId', requireUser,
[param('orderId').custom((item:string) => mongoose.isValidObjectId(item))] , validator,
async(req: Request, res: Response)=>{
    
    const order = await Orders.findById(req.params.orderId).populate('ticket');

    if(!order){
        throw new NotFoundError('Order not Found')
    }

    if(order.userId !== req.currentUser?.id){
        throw new UnAuthorizedError('Cant access other orders')
    }

    order.status = OrderStatus.Cancelled;

    await order.save()

    //publish an event that status is Cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {id : order.ticket.id},
        version: order.version
    })
    
    res.status(204).send(order)
})

export {router as DeleteOrder}