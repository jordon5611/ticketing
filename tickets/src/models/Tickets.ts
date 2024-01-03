import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketsAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketsDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number
  orderId?: string
}

interface TicketsModel extends mongoose.Model<TicketsDoc> {
  build(attrs: TicketsAttrs): TicketsDoc;
}

const TicketsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title must be required"],
    minlength: 5,
    maxlength: 50,
  },
  price: {
    type: Number,
    required: [true, "price must be required"],
  },
  userId: {
    type: String,
    required: [true, "Id must be required"],
  },
  orderId: {
    type: String
  }
});

TicketsSchema.set('versionKey', 'version')
TicketsSchema.plugin(updateIfCurrentPlugin)

TicketsSchema.statics.build = (attrs: TicketsAttrs) => {
  return new Tickets(attrs);
};

const Tickets = mongoose.model<TicketsDoc, TicketsModel>(
  "Ticket",
  TicketsSchema
);

export { Tickets };
