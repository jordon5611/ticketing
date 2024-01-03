import express from "express";
import "express-async-errors";
import { json } from "body-parser";


const app = express();
app.use(json());



import {
  BadRequest,
  errorhandlerFunc,
  NotFoundError,
  Verify,
} from "@jordonticketing/common";
import { CreatePayment } from "./routes/CreatePayment";

app.use(Verify);

app.use(CreatePayment)


app.all("*", async (req, res) => {
  throw new BadRequest("Routes Not Found");
});

app.use(errorhandlerFunc);

export { app };
