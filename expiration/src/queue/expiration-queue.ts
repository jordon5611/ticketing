import  Queue  from "bull";
import { ExpirationCompletedPublisher } from "../events/publisher/Expiration-Completed-publisher";
import { natsWrapper } from "../natsWrapper";

interface payload {
    orderId: string
}

const expirationQueue = new Queue<payload>('order:expiration', {
    redis:{
        host: process.env.REDIS_HOST,
    },
})

expirationQueue.process(async(job)=>{
    console.log('Here we will publish ExpirationCompleted event for OrderId', job.data.orderId);
    new ExpirationCompletedPublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
})

export {expirationQueue}