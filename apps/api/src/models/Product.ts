import mongoose, { Schema, Document } from 'mongoose';

export interface ProductDoc extends Document {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  department: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<ProductDoc>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
  },
  { timestamps: true }
);

ProductSchema.set('toJSON', {
  transform: (_, ret: any) => {
    ret.id = ret._id?.toString() ?? ret._id;
    if (ret._id) delete ret._id;
    if (ret.__v !== undefined) delete ret.__v;
  },
});

export default mongoose.models.Product || mongoose.model<ProductDoc>('Product', ProductSchema);