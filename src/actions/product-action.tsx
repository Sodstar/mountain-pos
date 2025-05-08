"use server";

import { connectDB } from "@/lib/mongodb";
import ProductModel, { IProduct } from "@/models/Product";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import CategoryModel from "@/models/Category";
import { Types } from "mongoose";
import BrandModel from "@/models/Brand";

// Internal function that will be cached
export const fetchFilteredProducts = async (filters: any) => {
  await connectDB();

  const { category, brand, minPrice, maxPrice, orderBy, lowStock } = filters;
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

  // Filter products with stock lower than stock_alert
  if (lowStock) {
    query.$expr = { $lt: ["$stock", "$stock_alert"] };
  }

  // Sorting logic
  let sortQuery: any = {};
  if (orderBy === "views_desc") sortQuery.views = -1;
  if (orderBy === "title_asc") sortQuery.title = 1;
  if (orderBy === "title_desc") sortQuery.title = -1;
  if (orderBy === "price_asc") sortQuery.price = 1;
  if (orderBy === "price_desc") sortQuery.price = -1;

  console.log("MongoDB Query:", query);

  try {
    const filteredProduct = await ProductModel.find(query)
      .populate("category")
      .populate("brand")
      .sort(sortQuery)
      .lean(); // Use lean() to get plain JavaScript objects instead of Mongoose documents

    if (!filteredProduct || filteredProduct.length === 0) {
      return [];
    }

    // Convert to a simple JSON structure to avoid circular references
    const safeProducts = filteredProduct.map((product) => {
      // Ensure ObjectId is converted to string
      return {
        ...product,
        _id: product._id.toString(),
        category: product.category
          ? {
              ...product.category,
              _id: product.category._id.toString(),
            }
          : null,
        brand: product.brand
          ? {
              ...product.brand,
              _id: product.brand._id.toString(),
            }
          : null,
      };
    });
    return safeProducts;
  } catch (error) {
    console.error("Error in getFilteredProducts:", error);
    throw new Error("Failed to fetch filtered products");
  }
};

export async function getFilteredProducts(filters: any) {
  // Generate a cache key based on the filters
  const cacheKey = `filtered-products-${JSON.stringify(filters)}`;

  return unstable_cache(
    async () => fetchFilteredProducts(filters),
    ["all-products"],
    { revalidate: 0 } // Revalidate after 60 seconds
  )();
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
  ["all-products"],
  // { revalidate: 60 * 60 }
  { revalidate: 1 }
);

export async function getProductById(productId: Types.ObjectId) {
  try {
    await connectDB();
    const product = await ProductModel.findById(productId);
    if (!product) throw new Error("Product not found");
    return JSON.parse(JSON.stringify(product));
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

export async function createProduct(productData: {
  code: string;
  barcode: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  stock_alert: number;
  category: string;
  brand: string;
  image?: string;
}) {
  try {
    await connectDB();

    const existingProduct = await ProductModel.findOne({
      $or: [{ code: productData.code }, { title: productData.title }],
    });

    if (existingProduct) {
      if (existingProduct.code === productData.code) {
        throw new Error("Product with this code already exists");
      } else {
        throw new Error("Product with this title already exists");
      }
    }

    const newProduct = new ProductModel(productData);
    await newProduct.save();

    revalidatePath("/admin/products");
    revalidateTag("all-products");
    return JSON.parse(JSON.stringify(newProduct));
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(
  productId: string,
  updateData: Partial<{
    code: string;
    barcode: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    stock_alert: number;
    category: string;
    brand: string;
    image: string;
    views: number;
  }>
) {
  try {
    await connectDB();

    // Check for duplicate code or title (but exclude current product)
    if (updateData.code || updateData.title) {
      const query: any = { _id: { $ne: productId } };

      if (updateData.code) {
        query.code = updateData.code;
      }

      if (updateData.title) {
        query.title = updateData.title;
      }

      const existingProduct = await ProductModel.findOne(query);

      if (existingProduct) {
        if (existingProduct.code === updateData.code) {
          throw new Error("Product with this code already exists");
        } else if (existingProduct.title === updateData.title) {
          throw new Error("Product with this title already exists");
        }
      }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) throw new Error("Product not found");

    revalidatePath("/admin/products");
    revalidateTag("all-products");

    return JSON.parse(JSON.stringify(updatedProduct));
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    await connectDB();
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) throw new Error("Product not found");

    revalidatePath("admin/products");
    revalidateTag("all-products");

    return { success: true };
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
