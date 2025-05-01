import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/Product";


export async function GET() {
    await connectDB();
    const product = await ProductModel.find({});
    if (!product) throw new Error("Product not found");

    return NextResponse.json({ success: true, data: product }, { status: 403 });

}


