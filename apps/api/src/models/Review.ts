import mongoose, { Schema, Document } from 'mongoose';

export type ReviewStatus = 'OPEN' | 'CLOSED';

export interface ReviewDoc extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  status: ReviewStatus;
}

const ReviewSchema = new Schema<ReviewDoc>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN', required: true },
  },
  { timestamps: true }
);

ReviewSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.models.Review || mongoose.model<ReviewDoc>('Review', ReviewSchema);