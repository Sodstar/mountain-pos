"use server";

import { connectDB } from "@/lib/mongodb";
import CategoryModel  from "@/models/Category";
import { revalidatePath, unstable_cache } from "next/cache";

export const getCachedCategories = unstable_cache(
  async (limit:number) => {
    try {
      await connectDB();
      const categories = await CategoryModel.find({}).limit(limit);
      return JSON.parse(JSON.stringify(categories));
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  },
  ["products"],
  { revalidate: 1 }
);

export async function getAllCategories() {
    try {
      await connectDB();
      const category = await CategoryModel.find({});
      if (!category) throw new Error("category not found");
      return JSON.parse(JSON.stringify(category));
    } catch (error) {
      throw new Error("Failed to fetch category"+error);
    }
  }

export async function getCategoryById(categoryId: Number) {
  try {
    await connectDB();
    const category = await CategoryModel.findById(categoryId);
    if (!category) throw new Error("category not found");
    return category;
  } catch (error) {
    throw new Error("Failed to fetch category");
  }
}

export async function checkExistingCategory(name: string) {
  try {
    await connectDB();
    return await CategoryModel.findOne({ name });
  } catch (error) {
    throw new Error("Failed to check category existence");
  }
}

export async function createCategory(
  name: string,
  description: string,
  slug: string
) {
  try {
    await connectDB();

    const existingCategory = await checkExistingCategory(name);
    if (existingCategory) throw new Error("Category already exists");

    const newCategory = new CategoryModel({ name, description, slug });
    await newCategory.save();


    return newCategory;
  } catch (error) {
    throw new Error("Failed to create category");
  }
}

export async function updateProduct(
    _id: Number,
  updateData: Partial<{ name: string; string: number; slug: string }>
) {
  try {
    await connectDB();
    const categoryUpdate = await CategoryModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!categoryUpdate) throw new Error("Category not found");

    // Revalidate cache
    // revalidatePath("/products");

    return categoryUpdate;
  } catch (error) {
    throw new Error("Failed to update category");
  }
}

export async function deleteProduct(categoryId: string) {
  try {
    await connectDB();
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) throw new Error("Product not found");

    // revalidatePath("/products");
    return deletedCategory;
  } catch (error) {
    throw new Error("Failed to delete category");
  }
}
