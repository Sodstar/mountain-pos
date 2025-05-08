import mongoose, { Schema, Document, Model, Types } from "mongoose";
import '@/models/Category';

export interface TProduct
{
  _id: string;
  barcode: string;
  code: string;
  title: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  stock_alert: number;
  views: number;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;

}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  barcode: string;
  code: string;
  title: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  stock_alert: number;
  views: number;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    barcode: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: false },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    image: { type: String, required: false },
    stock: { type: Number, required: true, default: 0 },
    stock_alert: { type: Number, required: true, default: 1 },
    views: { type: Number, required: true, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }
  },
  {
    timestamps: true,
    collection: 'products' // Explicitly set collection name
  });

const ProductModel: Model<IProduct> =
  mongoose.models.Products ||
  mongoose.model<IProduct>("Products", ProductSchema);

export default ProductModel;
