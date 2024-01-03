import { BadRequest, NotFoundError, OrderStatus, UnAuthorizedError, requireUser, validator } from "@jordonticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Orders } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publisher/PaymentCreated-Publisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router()


router.post('/api/payments', requireUser,[body('token').not().notEmpty().withMessage('Token should be valid')
,body('orderId').not().notEmpty().custom((item:string) => mongoose.isValidObjectId(item)).withMessage('OrderId should be valid')], 
validator, async(req: Request, res:Response)=>{

    const {orderId, token} = req.body

    const order = await Orders.findById(orderId)

    if(!order){
        throw new NotFoundError('Order not found')
    }

    if(order.userId !== req.currentUser?.id){
        throw new UnAuthorizedError('Not Authorized')
    }

    if(order.status === OrderStatus.Cancelled){
        throw new BadRequest('Order Status is Cancelled')
    }

    const charge = await stripe.charges.create({
        source: token,
        amount: order.price * 100, // amount in cents
        currency: 'usd',
        description: 'Payment for order ' + order.id,
    });

    const payment = new Payment({
    orderId,
    stripeId: charge.id
    })

    await payment.save()


    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })


    res.status(201).send(payment)
})

export {router as CreatePayment}