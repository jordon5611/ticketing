import express from "express";
import { requireUser } from "@jordonticketing/common";
import { Orders } from "../model/order";
import { Ticket } from "../model/ticket";

const router = express.Router()

router.get('/api/orders', requireUser ,async(req, res)=>{
    const orders = await Orders.find({userId:req.currentUser?.id}).populate('ticket')
    res.status(200).send(orders)
})

export {router as ShowAll}