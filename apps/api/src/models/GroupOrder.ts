import mongoose, { Schema, Document } from 'mongoose';

export type GroupOrderStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';

export interface GroupOrderDoc extends Document {
  order: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  deadline: Date;
  status: GroupOrderStatus;
}

const GroupOrderSchema = new Schema<GroupOrderDoc>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['OPEN', 'CLOSED', 'CANCELLED'], 
      default: 'OPEN', 
      required: true 
    },
  },
  { timestamps: true }
);

GroupOrderSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.models.GroupOrder || mongoose.model<GroupOrderDoc>('GroupOrder', GroupOrderSchema);