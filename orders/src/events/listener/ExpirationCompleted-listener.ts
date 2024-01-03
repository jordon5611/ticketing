import { Listener, NotFoundError, OrderStatus, Subjects } from "@jordonticketing/common";
import { Message } from "node-nats-streaming";
import { Orders } from "../../model/order";
import { OrderCancelledPublisher } from "../publisher/orderCancelled-publisher";


export class ExpirationCompletedListener extends Listener{
    subject = Subjects.ExpirationCompleted;
    queueGroupName = 'Orders-Service'
    
    async onMessage(data: any, msg: Message) {
        const {orderId} = data

        const order = await Orders.findById(orderId).populate('ticket')

        if(!order){
            throw new NotFoundError('Order is not Found')
        }

        if(order.status === OrderStatus.Completed){
            return msg.ack()
        }

        order.status = OrderStatus.Cancelled

        await order.save()

        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            ticket: {id : order.ticket.id},
            version: order.version
        })


        msg.ack()
        
    }
}