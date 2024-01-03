import { Subjects, Publisher } from "@jordonticketing/common";

export class OrderCreatedPublisher extends Publisher{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}