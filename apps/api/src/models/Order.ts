import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderDoc extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress?: string;
  notes?: string;
}

const OrderSchema = new Schema<OrderDoc>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { 
      type: String, 
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], 
      default: 'PENDING', 
      required: true 
    },
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.models.Order || mongoose.model<OrderDoc>('Order', OrderSchema);