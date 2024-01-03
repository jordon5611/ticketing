import { Publisher, Subjects } from "@jordonticketing/common";


export class ExpirationCompletedPublisher extends Publisher{
    subject = Subjects.ExpirationCompleted; 
}