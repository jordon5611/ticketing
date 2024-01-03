import express from "express";
import "express-async-errors";
import { json } from "body-parser";

const app = express();
app.use(json());

import { CurrentUser } from "./routes/currents-user";
import { SignIn } from "./routes/signin";
import { SignUp } from "./routes/signup";
import { SignOut } from "./routes/signout";
import {
  BadRequest,
  errorhandlerFunc,
  NotFoundError,
} from "@jordonticketing/common";

app.use(CurrentUser);
app.use(SignIn);
app.use(SignOut);
app.use(SignUp);

app.all("*", async (req, res) => {
  throw new BadRequest("Routes not found");
});

app.use(errorhandlerFunc);

export { app };
