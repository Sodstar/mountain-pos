"use server";

import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/Brand";
import { revalidatePath, unstable_cache } from "next/cache";

export async function getAllBrands() {
  try {
    await connectDB();
    const brands = await BrandModel.find({});
    if (!brands) throw new Error("brand not found");
    return JSON.parse(JSON.stringify(brands));
  } catch (error) {
    throw new Error("Failed to fetch brands" + error);
  }
}
