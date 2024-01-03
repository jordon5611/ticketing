import mongoose from "mongoose";
import { OrderStatus } from "@jordonticketing/common";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";



interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket : TicketDoc
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket : TicketDoc
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderScheme = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String, 
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket'
    }
})
orderScheme.set('versionKey', 'version')
orderScheme.plugin(updateIfCurrentPlugin)

orderScheme.statics.build = (attrs: OrderAttrs) => {
    return new Orders(attrs);
}


const Orders = mongoose.model<OrderDoc, OrderModel>('order', orderScheme)

export {Orders}