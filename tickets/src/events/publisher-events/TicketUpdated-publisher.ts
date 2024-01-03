import { Subjects, Publisher, TicketCreatedInterface } from "@jordonticketing/common";


export class TicketUpdatedPublisher extends Publisher {

    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}