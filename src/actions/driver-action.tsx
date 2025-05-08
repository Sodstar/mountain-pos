"use server";

import { connectDB } from "@/lib/mongodb";
import DriverModel, { TDriver } from "@/models/Driver";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export const getAllDrivers = unstable_cache(
  async () => {
    try {
      await connectDB();
      const drivers = await DriverModel.find({}).sort({ name: 1 });
      if (!drivers) throw new Error("Drivers not found");

      // Convert MongoDB documents to plain JavaScript objects
      return JSON.parse(JSON.stringify(drivers));
    } catch (error) {
      throw new Error(`Failed to fetch drivers: ${error}`);
    }
  },
  ["all-drivers"],
  { revalidate: 1 }
);

export async function getDrivers() {
  try {
    await connectDB();
    const drivers = await DriverModel.find({}).sort({ name: 1 });
    return JSON.parse(JSON.stringify(drivers));
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
    throw new Error("Failed to fetch drivers");
  }
}

export async function getDriverById(id: string) {
  try {
    await connectDB();
    const driver = await DriverModel.findById(id);
    if (!driver) throw new Error("Driver not found");
    return JSON.parse(JSON.stringify(driver));
  } catch (error) {
    console.error("Failed to fetch driver:", error);
    throw new Error("Failed to fetch driver");
  }
}

export async function checkExistingDriverByPin(pin: string) {
  try {
    await connectDB();
    return await DriverModel.findOne({ pin });
  } catch (error) {
    throw new Error("Failed to check driver existence");
  }
}

export async function checkExistingDriverByVehicle(vehicle: string) {
  try {
    await connectDB();
    return await DriverModel.findOne({ vehicle });
  } catch (error) {
    throw new Error("Failed to check vehicle existence");
  }
}

export async function createDriver(
  newData: Partial<{ name: string; phone: string; pin: string; vehicle: string }>
) {
  try {
    await connectDB();

    const existingDriverWithPin = await checkExistingDriverByPin(newData?.pin || "");
    if (existingDriverWithPin) throw new Error("Driver with this PIN already exists");
    
    const existingDriverWithVehicle = await checkExistingDriverByVehicle(newData?.vehicle || "");
    if (existingDriverWithVehicle) throw new Error("Vehicle is already assigned to another driver");
    
    const newDriver = new DriverModel(newData);
    await newDriver.save();
    // Clear the cache for drivers
    revalidateTag("all-drivers");
    revalidatePath("/admin/drivers");
    return JSON.parse(JSON.stringify(newDriver));
  } catch (error) {
    throw new Error(`Failed to create driver: ${error}`);
  }
}

export async function updateDriver(
  _id: string,
  updateData: Partial<{ name: string; phone: string; pin: string; vehicle: string }>
) {
  try {
    await connectDB();
    
    // Check if PIN already exists (if updating PIN)
    if (updateData.pin) {
      const existingDriverWithPin = await DriverModel.findOne({ pin: updateData.pin, _id: { $ne: _id } });
      if (existingDriverWithPin) throw new Error("Driver with this PIN already exists");
    }
    
    // Check if vehicle already exists (if updating vehicle)
    if (updateData.vehicle) {
      const existingDriverWithVehicle = await DriverModel.findOne({ vehicle: updateData.vehicle, _id: { $ne: _id } });
      if (existingDriverWithVehicle) throw new Error("Vehicle is already assigned to another driver");
    }
    
    const driverUpdate = await DriverModel.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!driverUpdate) throw new Error("Driver not found");

    // Clear the cache for drivers
    revalidateTag("all-drivers");
    revalidatePath("/admin/drivers");

    return JSON.parse(JSON.stringify(driverUpdate));
  } catch (error) {
    throw new Error(`Failed to update driver: ${error}`);
  }
}

export async function deleteDriver(driverId: string) {
  try {
    await connectDB();
    const deletedDriver = await DriverModel.findByIdAndDelete(driverId);

    if (!deletedDriver) throw new Error("Driver not found");

    // Clear the cache for drivers
    revalidateTag("all-drivers");
    revalidatePath("/admin/drivers");

    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete driver");
  }
}
