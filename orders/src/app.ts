import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { CreateOrder } from "./routes/CreateOrder";
import { ShowOne } from "./routes/showOneOrder";
import { ShowAll } from "./routes/showAllOrders";
import { DeleteOrder } from "./routes/DeleteOrder";

const app = express();
app.use(json());

import {
  BadRequest,
  errorhandlerFunc,
  NotFoundError,
  Verify,
} from "@jordonticketing/common";

app.use(Verify);

app.use(ShowAll);
app.use(CreateOrder);
app.use(ShowOne);
app.use(DeleteOrder);

app.all("*", async (req, res) => {
  throw new BadRequest("Routes Not Found");
});

app.use(errorhandlerFunc);

export { app };
