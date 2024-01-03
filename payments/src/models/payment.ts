import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttrs {
    orderId: string,
    stripeId: string
}

interface PaymentDoc extends mongoose.Document {
    orderId: string
    stripeId: string

}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    },
})

paymentSchema.statics.build = (attr: PaymentAttrs) => {
    return new Payment(attr)
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('payment', paymentSchema);

export {Payment}