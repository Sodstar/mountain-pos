// src/models/User.ts
import mongoose from 'mongoose';

// Define possible user roles
export type UserRole = 'user' | 'admin';

// Declare the interface for the user document
interface IUser extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Check if the model already exists to prevent overwriting
const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Using mongoose.models.User first prevents the error when model is redefined in development with hot reloading
export default mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);