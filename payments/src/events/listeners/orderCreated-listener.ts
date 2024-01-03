import { Listener, Subjects } from "@jordonticketing/common";
import { Message } from "node-nats-streaming";
import { Orders } from "../../models/order";


export class OrderCreatedListener extends Listener {
    subject = Subjects.OrderCreated;
    queueGroupName = 'payments-service'

    async onMessage(data: any, msg: Message) {
        const {id, userId, status, ticket, version} = data

        const order = Orders.build({
            id: id,
            userId: userId,
            status: status,
            version: version,
            price: ticket.price
        })

        await order.save()

        msg.ack()
    }
}