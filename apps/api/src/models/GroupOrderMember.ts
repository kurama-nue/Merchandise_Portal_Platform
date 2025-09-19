import mongoose, { Schema, Document } from 'mongoose';

export interface GroupOrderMemberDoc extends Document {
  groupOrder: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  joinedAt: Date;
}

const GroupOrderMemberSchema = new Schema<GroupOrderMemberDoc>(
  {
    groupOrder: { type: Schema.Types.ObjectId, ref: 'GroupOrder', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

GroupOrderMemberSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.models.GroupOrderMember || mongoose.model<GroupOrderMemberDoc>('GroupOrderMember', GroupOrderMemberSchema);