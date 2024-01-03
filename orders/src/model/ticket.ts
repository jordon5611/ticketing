import mongoose from "mongoose";
import { OrderStatus } from "@jordonticketing/common";
import { Orders } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    id: string
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
    FindByVersion(id: string, version: number): Promise<TicketDoc | null>
}

const TicketScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number, 
        required: true,
        min: 0
    },
    
})
TicketScheme.set('versionKey', 'version')
TicketScheme.plugin(updateIfCurrentPlugin)

TicketScheme.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        price: attrs.price,
        title: attrs.title
    })
}

TicketScheme.statics.FindByVersion = (id: string, version: number) => {
    return Ticket.findOne({
        _id: id,
        version: version - 1
    })
}

TicketScheme.methods.isReserved = async function (){
    const ExistingOrder = await Orders.findOne({
        ticket: this,
        status:{
            $in: [OrderStatus.AwaitingPayment, OrderStatus.Completed, OrderStatus.Created]
        }
    })
    return ExistingOrder
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('ticket', TicketScheme)

export {Ticket}