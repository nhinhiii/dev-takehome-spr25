import { dataRequests } from "@/lib/data";
import dbConnect from "@/lib/dbConnect";
import Request from "@/models/Request";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    await Request.deleteMany({});
    console.log("Cleared existing requests");

    await Request.insertMany(dataRequests);
    console.log("Inserted new data");

    return NextResponse.json({
      message: "Database seeded sucessfully!",
      count: dataRequests.length,
    });
  } catch (error: any) {
    console.log("Error seeding database:", error);
    return NextResponse.json(
      {
        message: "Failed to seed database.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
