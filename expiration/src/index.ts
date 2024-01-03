import { OrderCreatedListener } from "./events/listener/OrderCreated-listener";
import { natsWrapper } from "./natsWrapper";


const start = async () => {

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

  } catch (error) {
    console.log(error);
  }
  
};

start();
