import mongoose from "mongoose";
import { OrderStatus } from "@jordonticketing/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";



interface OrderAttrs {
    id: string
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
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
    },
    price: {
        type: Number,
        required: true,
    }
})
orderScheme.set('versionKey', 'version')
orderScheme.plugin(updateIfCurrentPlugin)

orderScheme.statics.build = (attrs: OrderAttrs) => {
    return new Orders({
        _id : attrs.id,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price,
        version: attrs.version
    });
}


const Orders = mongoose.model<OrderDoc, OrderModel>('order', orderScheme)

export {Orders}