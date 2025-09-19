import mongoose, { Schema, Document } from 'mongoose';

export interface IndividualOrderDoc extends Document {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const IndividualOrderSchema = new Schema<IndividualOrderDoc>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

IndividualOrderSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.models.IndividualOrder || mongoose.model<IndividualOrderDoc>('IndividualOrder', IndividualOrderSchema);