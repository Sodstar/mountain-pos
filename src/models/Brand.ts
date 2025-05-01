import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
}

const CategorySchema = new Schema<IBrand>({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { 
  timestamps: true,
  collection: 'brands' // Explicitly set collection name
});

// Model name is 'Brand' but collection is 'brands'
const BrandModel: Model<IBrand> =
  mongoose.models.Brand ||
  mongoose.model<IBrand>("Brand", CategorySchema);

export default BrandModel;