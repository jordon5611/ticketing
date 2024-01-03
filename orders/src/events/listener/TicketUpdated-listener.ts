import { Listener, NotFoundError, Subjects } from "@jordonticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";


export class TicketUpdatedListener extends Listener {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = 'Orders-Service';
    async onMessage(data: any, msg: Message) {
        const {id, title, price, version} = data


        const ticket = await Ticket.FindByVersion(id, version)

        if(!ticket){
            throw new NotFoundError('Ticket not Found in the Tic-Updated listener')
        }
        ticket.title = title
        ticket.price = price

        await ticket.save()

        msg.ack()
    }
}