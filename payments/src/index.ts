import mongoose from "mongoose";
import { natsWrapper } from "./natsWrapper";

import { app } from "./app";
import { OrderCreatedListener } from "./events/listeners/orderCreated-listener";
import { OrderCancelledListener } from "./events/listeners/orderCancelled-listener";


const port = 2003;
const start = async () => {
  if (!process.env.STRIPE_KEY) {
    throw new Error("No Mongo URI found");
  }
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
    console.log(process.env.NATS_CLIENT_ID);
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

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()
    
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
