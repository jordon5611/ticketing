import { Listener, NotFoundError, Subjects } from "@jordonticketing/common";
import { Message } from "node-nats-streaming";
import { Tickets } from "../../models/Tickets";
import { TicketUpdatedPublisher } from "./TicketUpdated-publisher";


export class OrderCreatedListener extends Listener{
    subject = Subjects.OrderCreated;
    queueGroupName = 'Ticket-Service'

    async onMessage(data: any, msg: Message) {
        const {ticket,id,  } = data
        const Ticket = await Tickets.findById(ticket.id)

        if(!Ticket){
            throw new NotFoundError("Ticket Not Found");
        }

        Ticket.set({orderId: id})

        await Ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
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