import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/TicketCreated-publisher";
console.clear();
const client = nats.connect("ticketing", "abc", {
  url: "nats://nats-srv:4222",
});

client.on("connect", async () => {
  console.log("published Connected");

  // const publisher = new TicketCreatedPublisher(client);
  // try {
  //   await publisher.publish({
  //     id: "3456",
  //     title: "bhatti",
  //     price: 99,
  //   });
  // } catch (error) {
  //   console.error(error);
  // }
});
