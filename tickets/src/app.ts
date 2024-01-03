import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { createTickets } from "./routes/createTickets";
import { show } from "./routes/show";
import { ShowAll } from "./routes/showAll";
import { EditTickets } from "./routes/EditTickets";

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
app.use(show);
app.use(createTickets);
app.use(EditTickets);

app.all("*", async (req, res) => {
  throw new BadRequest("Routes Not Found");
});

app.use(errorhandlerFunc);

export { app };
