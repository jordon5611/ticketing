import { Listener, Subjects } from "@jordonticketing/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queue/expiration-queue";


export class OrderCreatedListener extends Listener {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = 'Expiration-service'

    async onMessage(data: any, msg: Message) {
        const {id, expiresAt} = data

        const delay = new Date(expiresAt).getTime() - new Date().getTime()
        console.log('Waiting for ', delay);

        expirationQueue.add({
            orderId: id
        },{
            delay: delay,
        }
        )

        msg.ack()
    }
}