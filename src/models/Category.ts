import mongoose, { Schema, Document, Model } from "mongoose";


export interface TCategory {
  _id: string;
  name: string;
  description: string;
  slug: string;
}

export interface ICategory extends Document {
  name: string;
  description: string;
  slug: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
}, { 
  timestamps: true,
  collection: 'categories' // Explicitly set collection name
});

// Model name is 'Category' but collection is 'categories'
const CategoryModel: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryModel;