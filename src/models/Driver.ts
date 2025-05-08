import mongoose, { Schema, Document, Model } from "mongoose";

export interface TDriver
{
  _id: string;
  name: string;
  phone: string;
  pin: string;
  vehicle: string;
}
export interface IDriver extends Document {
  name: string;
  phone: string;
  pin: string;
  vehicle: string;
}

const DriverSchema = new Schema<IDriver>({
  name: { type: String, required: true, unique: false },
  phone: { type: String, required: true, unique: false },
  pin: { type: String, required: true, unique: false },
  vehicle: { type: String, required: true, unique: true },
}, { 
  timestamps: true,
  collection: 'drivers'
});

const DriverModel: Model<IDriver> =
  mongoose.models.Driver ||
  mongoose.model<IDriver>("Driver", DriverSchema);

export default DriverModel;