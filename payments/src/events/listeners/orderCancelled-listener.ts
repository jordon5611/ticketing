import { Listener, OrderStatus, Subjects } from "@jordonticketing/common";
import { Message } from "node-nats-streaming";
import { Orders } from "../../models/order";


export class OrderCancelledListener extends Listener {
    subject = Subjects.OrderCancelled;
    queueGroupName = 'payments-service'

    async onMessage(data: any, msg: Message) {
        const {id , version} = data

        const order = await Orders.findOne({
            _id: id,
            version: version - 1
        })

        if(!order){
            throw new Error("Order not found");
        }

        order.set({status: OrderStatus.Cancelled})

        await order.save()

        msg.ack()
    }
}