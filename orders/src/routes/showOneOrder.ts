import express, {Request, Response} from "express";
import { Orders } from "../model/order";
import { BadRequest, NotFoundError, UnAuthorizedError, requireUser, validator } from "@jordonticketing/common";
import { param } from "express-validator";
import mongoose from "mongoose";
const router = express.Router()

router.get('/api/orders/:orderId',requireUser,
[param('orderId').custom((item:string) => mongoose.isValidObjectId(item))] , validator
, async(req: Request, res: Response)=>{
    const order = await Orders.findById(req.params.orderId).populate('ticket')

    if(!order){
        throw new NotFoundError('Order not Found')
    }

    if(order.userId !== req.currentUser?.id){
        throw new UnAuthorizedError('Cant access other orders')
    }


    res.send(order)
})

export {router as ShowOne}