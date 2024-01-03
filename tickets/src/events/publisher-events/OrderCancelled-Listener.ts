import { Listener, NotFoundError, Subjects } from "@jordonticketing/common";
import { Message } from "node-nats-streaming";
import { Tickets } from "../../models/Tickets";
import { TicketUpdatedPublisher } from "./TicketUpdated-publisher";



export class OrderCancelledListener extends Listener{
    subject = Subjects.OrderCancelled;
    queueGroupName = 'Ticket-Service'

    async onMessage(data: any, msg: Message) {
        const {id, ticket} = data

        const Ticket = await Tickets.findById(ticket.id)
        if(!Ticket){
            throw new NotFoundError('Ticket not found')
        }

        Ticket.set({orderId: undefined})

        await Ticket.save()

        new TicketUpdatedPublisher(this.client).publish({
            id: Ticket.id,
            title: Ticket.title,
            price: Ticket.price,
            userId: Ticket.userId,
            version: Ticket.version,
            orderId: Ticket.orderId
        })

        msg.ack()
    }

}