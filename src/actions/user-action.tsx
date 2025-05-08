"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import bcrypt from "bcryptjs";

export const getAllUsers = unstable_cache(
  async () => {
    try {
      await connectDB();
      const users = await User.find({}).select("-password");
      if (!users) throw new Error("Users not found");
      return users;
    } catch (error) {
      throw new Error("Failed to fetch users" + error);
    }
  },
  ["all-users"],
  { revalidate: 60 * 60 }
);

export const getAllCachedUsers = unstable_cache(
  async () => {
    try {
      await connectDB();
      const users = await User.find({}).select("-password").sort({ name: 1 });
      if (!users) throw new Error("Users not found");

      // Convert MongoDB documents to plain JavaScript objects
      return JSON.parse(JSON.stringify(users));
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  },
  ["all-users"],
  { revalidate: 1 }
);

export async function getUserById(userId: string) {
  try {
    await connectDB();
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User not found");
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
}

export async function checkExistingUser(email: string) {
  try {
    await connectDB();
    return await User.findOne({ email });
  } catch (error) {
    throw new Error("Failed to check user existence");
  }
}

export async function createUser(
  newData: Partial<{
    name: string;
    email: string;
    phone: string;
    password: string;
    image: string;
    role: string;
  }>
) {
  try {
    await connectDB();

    const existingUser = await checkExistingUser(newData?.email || "");
    if (existingUser) throw new Error("User with this email already exists");

    // Hash password if provided
    if (newData.password) {
      newData.password = await bcrypt.hash(newData.password, 10);
    }

    const newUser = new User(newData);
    await newUser.save();
    // Clear the cache for users
    revalidateTag("all-users");
    revalidatePath("/admin/users");

    const userWithoutPassword = { ...newUser.toJSON(), password: undefined };
    return JSON.parse(JSON.stringify(userWithoutPassword));
  } catch (error) {
    throw new Error("Failed to create user");
  }
}

export async function updateUser(
  _id: string,
  updateData: Partial<{
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }>
) {
  try {
    await connectDB();

    // If updating password, hash it first
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const userUpdate = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    }).select("-password");

    if (!userUpdate) throw new Error("User not found");

    // Clear the cache for users
    revalidateTag("all-users");
    revalidatePath("/admin/users");

    return JSON.parse(JSON.stringify(userUpdate));
  } catch (error) {
    throw new Error("Failed to update user");
  }
}

export async function deleteUser(userId: string) {
  try {
    await connectDB();
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) throw new Error("User not found");

    // Clear the cache for users
    revalidateTag("all-users");
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete user");
  }
}

export async function changeUserRole(userId: string, newRole: string) {
  try {
    await connectDB();
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select("-password");

    if (!userUpdate) throw new Error("User not found");

    // Clear the cache for users
    revalidateTag("all-users");
    revalidatePath("/admin/users");

    return JSON.parse(JSON.stringify(userUpdate));
  } catch (error) {
    throw new Error("Failed to update user role");
  }
}

export async function changeUserPassword(userId: string, newPassword: string) {
  try {
    await connectDB();
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    ).select("-password");
    
    if (!updatedUser) throw new Error("User not found");
    
    // Clear the cache for users
    revalidateTag("all-users");
    revalidatePath("/admin/users");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    throw new Error(`Failed to change password: ${error}`);
  }
}
