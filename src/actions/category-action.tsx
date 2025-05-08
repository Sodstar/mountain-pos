"use server";

import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/models/Category";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export const getCachedCategories = unstable_cache(
  async (limit: number) => {
    try {
      await connectDB();
      const categories = await CategoryModel.find({})
        .sort({ name: 1 })
        .limit(limit);
      return JSON.parse(JSON.stringify(categories));
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  },
  ["products"],
  { revalidate: 60 * 60 }
);

export const getAllCategories = unstable_cache(
  async () => {
    try {
      await connectDB();
      const categories = await CategoryModel.find({}).sort({ name: 1 });
      if (!categories) throw new Error("Categories not found");

      // Convert MongoDB documents to plain JavaScript objects
      return JSON.parse(JSON.stringify(categories));
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error}`);
    }
  },
  ["all-categories"],
  { revalidate: 1 }
);

export async function getCategories() {
  try {
    await connectDB();
    const categories = await CategoryModel.find({}).sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getCategoryById(id: string) {
  try {
    await connectDB();
    const category = await CategoryModel.findById(id);
    if (!category) throw new Error("Category not found");
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Failed to fetch category:", error);
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
  newData: Partial<{ name: string; description: string; slug: string }>
) {
  try {
    await connectDB();

    const existingCategory = await checkExistingCategory(newData?.name || "");
    if (existingCategory) throw new Error("Category already exists");

    const newCategory = new CategoryModel(newData);
    await newCategory.save();
    // Clear the cache for categories
    revalidateTag("all-categories");
    revalidatePath("/admin/categories");
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    throw new Error("Failed to create category");
  }
}

export async function updateCategory(
  _id: string,
  updateData: Partial<{ name: string; description: string; slug: string }>
) {
  try {
    await connectDB();
    const categoryUpdate = await CategoryModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );
    if (!categoryUpdate) throw new Error("Category not found");

    // Clear the cache for categories
    revalidateTag("all-categories");
    revalidatePath("/admin/categories");

    return JSON.parse(JSON.stringify(categoryUpdate));
  } catch (error) {
    throw new Error("Failed to update category");
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await connectDB();
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) throw new Error("Category not found");

    // Clear the cache for categories
    revalidateTag("all-categories");
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete category");
  }
}
