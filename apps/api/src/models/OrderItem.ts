import mongoose, { Schema, Document } from 'mongoose';

export interface OrderItemDoc extends Document {
  order: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

const OrderItemSchema = new Schema<OrderItemDoc>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

OrderItemSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.models.OrderItem || mongoose.model<OrderItemDoc>('OrderItem', OrderItemSchema);