import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import dbConnect from "@/lib/dbConnect";
import Request from "@/models/Request";
import { NextRequest, NextResponse } from "next/server";
import { RequestStatus } from "@/lib/types/request";

function formatRequest(dbRequest: any) {
  return {
    id: dbRequest._id.toString(),
    requestorName: dbRequest.requestorName,
    itemRequested: dbRequest.itemRequested,
    status: dbRequest.status,
    requestCreatedDate: dbRequest.requestCreatedDate.toISOString(),
    lastEditedDate: dbRequest.lastEditedDate
      ? dbRequest.lastEditedDate.toISOString()
      : null,
  };
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { requestorName, itemRequested } = await request.json();
    if (!requestorName || !itemRequested) {
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
    console.error("Error creating request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const status = searchParams.get("status") as RequestStatus | null;

    const filter: any = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (page - 1) * PAGINATION_PAGE_SIZE;
    const totalRecords = await Request.countDocuments(filter);
    const dbRequests = await Request.find(filter)
      .sort({ requestCreatedDate: -1 })
      .skip(skip)
      .limit(PAGINATION_PAGE_SIZE)
      .lean();

    const formattedData = dbRequests.map(formatRequest);

    return NextResponse.json({
      data: formattedData,
      page,
      totalRecords,
      pageSize: PAGINATION_PAGE_SIZE,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ids, status } = body;

    if (!status) {
      return NextResponse.json(
        { message: "Status is required for update." },
        { status: 400 }
      );
    }

    if (id) {
      const updatedRequest = await Request.findByIdAndUpdate(
        id,
        { $set: { status: status, lastEditedDate: new Date() } },
        { new: true }
      );

      if (!updatedRequest) {
        return NextResponse.json(
          { message: `Request with ID ${id} not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json(formatRequest(updatedRequest), { status: 200 });
    } else if (ids && Array.isArray(ids) && ids.length > 0) {
      const updateResult = await Request.updateMany(
        { _id: { $in: ids } },
        { $set: { status: status, lastEditedDate: new Date() } }
      );
      if (updateResult.matchedCount === 0) {
        return NextResponse.json(
          { message: "No matching requests found for the given IDs." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          message: `${updateResult.modifiedCount} requests updated successfully.`,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message:
            "Invalid request body. Provide either a single 'id' or an array of 'ids'.",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    if (error.name === "CastError") {
      return NextResponse.json(
        { message: `Invalid ID format provided.` },
        { status: 400 }
      );
    }
    console.error("Error updating request(s):", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "An array of request IDs is required for deletion." },
        { status: 400 }
      );
    }

    const deleteResult = await Request.deleteMany({
      _id: { $in: ids },
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        {
          message: "No matching requests found with the given IDs",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `${deleteResult.deletedCount} requests deleted successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === "CastError") {
      return NextResponse.json(
        { message: `Invalid ID format found in the provided list` },
        { status: 400 }
      );
    }
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
