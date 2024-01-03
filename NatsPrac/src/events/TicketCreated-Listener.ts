import { Listener } from "./AbstractListener";
import { Message } from "node-nats-streaming";
import { TicketCreatedInterface } from "./TicketCreatedInterface";
import { Subjects } from "./subjects";

export class TicketCreated extends Listener<TicketCreatedInterface> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "order-service-queueList";

  onMessage(data: TicketCreatedInterface["data"], msg: Message): void {
    console.log("Data: ", data);

    msg.ack();
  }
}
