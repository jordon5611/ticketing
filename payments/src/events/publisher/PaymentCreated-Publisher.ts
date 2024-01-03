import { Publisher, Subjects } from "@jordonticketing/common";


export class PaymentCreatedPublisher extends Publisher {

    subject = Subjects.PaymentCreated;
}