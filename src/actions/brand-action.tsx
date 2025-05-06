"use server";

import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/Brand";
import { revalidatePath, unstable_cache } from "next/cache";

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
