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

export async function deleteBrand(brandId: string) {
  try {
    await connectDB();
    const deletedCategory = await BrandModel.findByIdAndDelete(brandId);

    if (!deletedCategory) throw new Error("Brand not found");

    // Clear the cache for categories
    revalidateTag("all-brands");
    revalidatePath("/admin/brabds");

    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete brabd");
  }
}
