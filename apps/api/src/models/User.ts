import mongoose, { Schema, Document } from 'mongoose';

// Define user roles with specific permissions
export enum UserRole {
  ADMIN = 'ADMIN',           // Full system access
  MANAGER = 'MANAGER',       // Product and order management
  DEPT_HEAD = 'DEPT_HEAD',   // Department head for group orders
  DISTRIBUTOR = 'DISTRIBUTOR', // Handles distribution
  CUSTOMER = 'CUSTOMER'      // Regular user
}

// Define permissions for each role
export const RolePermissions = {
  [UserRole.ADMIN]: [
    'manage:all',
    'manage:users',
    'manage:products',
    'manage:orders',
    'manage:reviews',
    'manage:distribution',
    'view:reports'
  ],
  [UserRole.MANAGER]: [
    'manage:products',
    'manage:orders',
    'manage:reviews',
    'view:reports'
  ],
  [UserRole.DEPT_HEAD]: [
    'manage:group-orders',
    'view:department-users'
  ],
  [UserRole.DISTRIBUTOR]: [
    'manage:distribution',
    'view:orders'
  ],
  [UserRole.CUSTOMER]: [
    'create:orders',
    'view:own-orders',
    'create:reviews'
  ]
};

export interface UserDoc extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  department?: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { 
      type: String, 
      required: true, 
      default: UserRole.CUSTOMER,
      enum: Object.values(UserRole)
    },
    phone: { type: String },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
  },
  { timestamps: true }
);

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

export default mongoose.models.User || mongoose.model<UserDoc>('User', UserSchema);