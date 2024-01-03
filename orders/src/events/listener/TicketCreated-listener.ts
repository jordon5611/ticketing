import { Listener, Subjects } from "@jordonticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";


export class TicketCreatedListener extends Listener {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'Orders-Service';
    async onMessage(data: any, msg: Message) {
        
        const {id, title, price} = data
        const ticket = Ticket.build({
            id, title, price
        })
        await ticket.save()

        msg.ack()
    }
}