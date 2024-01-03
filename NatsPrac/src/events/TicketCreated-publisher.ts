import { Publisher } from "./Abstract-Publisher";
import { Subjects } from "./subjects";
import { TicketCreatedInterface } from "./TicketCreatedInterface";

export class TicketCreatedPublisher extends Publisher<TicketCreatedInterface> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
