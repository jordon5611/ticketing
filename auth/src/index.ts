import mongoose from "mongoose";

import { app } from "./app";

const port = 2000;
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("No Secret found");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("No Mongo URI found");
  }
  try {
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
