import { Subjects, Publisher, TicketCreatedInterface } from "@jordonticketing/common";


export class TicketCreatedPublisher extends Publisher {

    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}