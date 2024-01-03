import { Listener, NotFoundError, OrderStatus, Subjects } from "@jordonticketing/common";
import { Message } from "node-nats-streaming";
import { Orders } from "../../model/order";


export class PaymentCreatedListener extends Listener{
    subject = Subjects.PaymentCreated;
    queueGroupName = 'Orders-Service'

    async onMessage(data: any, msg: Message) {
        const {id, orderId, stripeId} = data

        const order = await Orders.findById(orderId)

        if(!order){
            throw new NotFoundError("Order not Found");
        }

        order.status = OrderStatus.Completed

        await order.save()

        msg.ack()
    }
}