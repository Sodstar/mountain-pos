"use server";

import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/Brand";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export const getAllBrands = unstable_cache(
  async () => {
    try {
      await connectDB();
      const brands = await BrandModel.find({});
      if (!brands) throw new Error("brand not found");
      return brands;
    } catch (error) {
      throw new Error("Failed to fetch brands" + error);
    }
  },
  ["all-brands"],
  { revalidate: 60 * 60 }
);

export const getAllCachedCategories = unstable_cache(
  async () => {
    try {
      await connectDB();
      const brands = await BrandModel.find({}).sort({ name: 1 });
      if (!brands) throw new Error("Brands not found");

      // Convert MongoDB documents to plain JavaScript objects
      return JSON.parse(JSON.stringify(brands));
    } catch (error) {
      throw new Error(`Failed to fetch brands: ${error}`);
    }
  },
  ["all-brands"],
  { revalidate: 1 }
);

export async function getBrandById(brandId: string) {
  try {
    await connectDB();
    const brand = await BrandModel.findById(brandId);
    if (!brand) throw new Error("brand not found");
    return JSON.parse(JSON.stringify(brand));
  } catch (error) {
    throw new Error("Failed to fetch brand");
  }
}
export async function checkExistingBrand(name: string) {
  try {
    await connectDB();
    return await BrandModel.findOne({ name });
  } catch (error) {
    throw new Error("Failed to check brand existence");
  }
}

export async function createBrand(
  newData: Partial<{ name: string; slug: string }>
) {
  try {
    await connectDB();

    const existingBrand = await checkExistingBrand(newData?.name || "");
    if (existingBrand) throw new Error("Brand already exists");
    
    const newBrand = new BrandModel(newData);
    await newBrand.save();
    // Clear the cache for categories
    revalidateTag("all-brands");
    revalidatePath("/admin/brands");
    return JSON.parse(JSON.stringify(newBrand));
  } catch (error) {
    throw new Error("Failed to create brand");
  }
}

export async function updateBrand(
  _id: string,
  updateData: Partial<{ name: string; slug: string }>
) {
  try {
    await connectDB();
    const brandUpdate = await BrandModel.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!brandUpdate) throw new Error("Brand not found");

    // Clear the cache for categories
    revalidateTag("all-brands");
    revalidatePath("/admin/brands");

    return JSON.parse(JSON.stringify(brandUpdate));
  } catch (error) {
    throw new Error("Failed to update category");
  }
}

export async function deleteBrand(brandId: string) {
  try {
    await connectDB();
    const deletedBrand = await BrandModel.findByIdAndDelete(brandId);

    if (!deletedBrand) throw new Error("Brand not found");

    // Clear the cache for categories
    revalidateTag("all-brands");
    revalidatePath("/admin/brands");

    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete brand");
  }
}
