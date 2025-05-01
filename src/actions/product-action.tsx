"use server";

import { connectDB } from "@/lib/mongodb";
import ProductModel, { IProduct } from "@/models/Product";
import { revalidatePath, unstable_cache } from "next/cache";
import CategoryModel from "@/models/Category";
import { Types } from "mongoose";
import BrandModel from "@/models/Brand";

export async function getFilteredProducts(filters: any) {
  await connectDB();

  const { category, brand, minPrice, maxPrice, orderBy } = filters;
  let query: any = {};

  // Debugging the received filters
  console.log("Received Filters:", filters);

  // Filter by category
  if (category) {
    const categoryOne = await CategoryModel.findOne({ slug: category });
    if (categoryOne) {
      query.category = categoryOne._id; // Mongoose automatically converts to ObjectId
      console.log("Category Found:", categoryOne);
    } else {
      console.log("No category found for slug:", category);
    }
  }

  // Filter by brand
  if (brand) {
    const brandOne = await BrandModel.findOne({ slug: brand });
    if (brandOne) {
      query.brand = brandOne._id; // Mongoose automatically converts to ObjectId
      console.log("Brand Found:", brandOne);
    } else {
      console.log("No brand found for slug:", brand);
    }
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sorting logic
  let sortQuery: any = {};
  if (orderBy === "title_asc") sortQuery.title = 1;
  if (orderBy === "title_desc") sortQuery.title = -1;
  if (orderBy === "price_asc") sortQuery.price = 1;
  if (orderBy === "price_desc") sortQuery.price = -1;

  console.log("MongoDB Query:", query);

  try {
    const filteredProduct = await ProductModel.find(query)
      .populate("category")
      .sort(sortQuery);

    // console.log("Filtered Products:", filteredProduct);

    if (!filteredProduct || filteredProduct.length === 0) {
      return [];
    }
    // revalidatePath("/products");
    return JSON.stringify(filteredProduct);
  } catch (error) {
    throw new Error("Failed to fetch filtered products");
  }
}

export const getCachedProducts = unstable_cache(
  async (limit: number) => {
    try {
      await connectDB();
      const products = await ProductModel.find({}).limit(limit);
      return products;
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },
  ["products"],
  { revalidate: 3600, tags: ["products"] }
);

export async function getProductById(productId: Types.ObjectId) {
  try {
    await connectDB();
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error("Product not found");
    return product;
  } catch (error) {
    throw new Error("Failed to fetch product");
  }
}

export async function checkProductCount(productId: Number) {
  try {
    await connectDB();
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error("Product not found");
    return product.stock;
  } catch (error) {
    throw new Error("Failed to fetch product");
  }
}

export async function checkExistingProduct(name: string) {
  try {
    await connectDB();
    return await ProductModel.findOne({ name });
  } catch (error) {
    throw new Error("Failed to check product existence");
  }
}

export async function createProduct(
  name: string,
  price: number,
  description: string
) {
  try {
    await connectDB();

    const existingProduct = await checkExistingProduct(name);
    if (existingProduct) throw new Error("Product already exists");

    const newProduct = new ProductModel({ name, price, description });
    await newProduct.save();

    revalidatePath("/products");

    return newProduct;
  } catch (error) {
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(
  productId: string,
  updateData: Partial<{ name: string; price: number; description: string }>
) {
  try {
    await connectDB();
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) throw new Error("Product not found");

    // Revalidate cache
    revalidatePath("/products");

    return updatedProduct;
  } catch (error) {
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(productId: string) {
  try {
    await connectDB();
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) throw new Error("Product not found");

    revalidatePath("/products");

    return deletedProduct;
  } catch (error) {
    throw new Error("Failed to delete product");
  }
}
export async function getCategoryCounts() {
  await connectDB();
  const results = await ProductModel.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $project: {
        _id: 1,
        slug: "$categoryInfo.slug",
        category: "$categoryInfo.name",
        count: 1,
      },
    },
  ]);

  return results; // [{ category: "Jersey", count: 2 }, ...]
}

export async function getProductsWithCategory() {
  try {
    await connectDB();
    const products = await ProductModel.find({})
      .populate("category", "_id name slug")
      .select("title price category");

    return products;
  } catch (error) {
    throw new Error("Failed to fetch products with categories");
  }
}
