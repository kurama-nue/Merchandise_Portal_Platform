import mongoose, { Schema, Document } from 'mongoose';

export interface DepartmentDoc extends Document {
  name: string;
  description?: string;
}

const DepartmentSchema = new Schema<DepartmentDoc>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

DepartmentSchema.set('toJSON', {
  transform: (_, ret: any) => {
    ret.id = ret._id?.toString() ?? ret._id;
    if (ret._id) delete ret._id;
    if (ret.__v !== undefined) delete ret.__v;
  },
});

export default mongoose.models.Department || mongoose.model<DepartmentDoc>('Department', DepartmentSchema);