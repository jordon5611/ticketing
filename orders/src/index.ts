import mongoose from "mongoose";
import { natsWrapper } from "./natsWrapper";

import { app } from "./app";
import { TicketCreatedListener } from "./events/listener/TicketCreated-listener";
import { TicketUpdatedListener } from "./events/listener/TicketUpdated-listener";
import { ExpirationCompletedListener } from "./events/listener/ExpirationCompleted-listener";
import { PaymentCreatedListener } from "./events/listener/PaymentCreated-listener";

const port = 2002;
const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("No Mongo URI found");
  }
  if (!process.env.JWT_KEY) {
    throw new Error("No Secret found");
  }
  if (!process.env.NATS_URI) {
    throw new Error("No Secret found");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("No Secret found");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("No Secret found");
  }


  try {
    
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );
    natsWrapper.client.on("close", () => {
      console.log("Closing this Client");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompletedListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
  app.listen(port, () => {
    console.log(`Listening at ${port}`);
  });
};

start();
