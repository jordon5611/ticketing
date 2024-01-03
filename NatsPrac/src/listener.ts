import nats, { Message, Stan } from "node-nats-streaming";
import { TicketCreated } from "./events/TicketCreated-Listener";
import { randomBytes } from "crypto";
import { Listener } from "./events/AbstractListener";
console.clear();
const client = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4040",
});

client.on("connect", () => {
  console.log("Connected with publisher");

  client.on("close", () => {
    console.log("Closing this Client");
    process.exit();
  });

  new TicketCreated(client).listen();
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
