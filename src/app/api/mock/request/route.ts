import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

function formatRequest(dbRequest: any) {
  return {
    id: dbRequest._id.toString(),
    requestorName: dbRequest.requestorName,
    itemRequested: dbRequest.itemRequested,
    status: dbRequest.status,
    requestCreatedDate: dbRequest.requestCreatedDate.toISOString(),
    lastEditedDated: dbRequest.lastEditedDate
      ? dbRequest.lastEditedDate.toIOString()
      : null,
  };
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { requestorName, itemRequested } = await request.json();
    if (!requestorName || itemRequested) {
      return NextResponse.json(
        { message: "Requestor name and item are required." },
        { status: 400 }
      );
    }

    const newRequest = new Request({
      requestorName,
      itemRequested,
    });

    await newRequest.save();
    return NextResponse.json(formatRequest(newRequest), { status: 201 });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.log("Error creating request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
