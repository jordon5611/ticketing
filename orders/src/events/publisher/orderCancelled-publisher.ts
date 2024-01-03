import { Subjects, Publisher } from "@jordonticketing/common";

export class OrderCancelledPublisher extends Publisher{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}