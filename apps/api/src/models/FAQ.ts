import mongoose, { Schema, Document } from 'mongoose';

export interface FAQDoc extends Document {
  product: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  isPublished: boolean;
}

const FAQSchema = new Schema<FAQDoc>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FAQSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.models.FAQ || mongoose.model<FAQDoc>('FAQ', FAQSchema);