import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
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

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");

    const filter: any = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (page -1) * PAGINATION_PAGE_SIZE;
    const totalRecords = await Request.countDocuments(filter);
    const dbRequests = await Request.find(filter)
      .sort({reuestCreatedDate: -1})
      .skip(skip)
      .limit(PAGINATION_PAGE_SIZE)
      .lean();
    
    const formattedData = dbRequests.map(formatRequest);

    return NextResponse.json({
      data: formattedData,
      page,
      totalRecords,
      pageSizeL: PAGINATION_PAGE_SIZE,
    })
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({message: "Internal Server Error"}, {status: 500});
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const {id, ids, status} = body;

    if(!status) {
      return NextResponse.json({message: "Status is required for update."}, {status: 400})
    }

    if(id) {
      const updatedRequest = await Request.findByAndUpdate(
        id,
        {$set: {status: status, lastEditedDate: new Date()}},
        {new: true}
      );

      if(!updatedRequest) {
        return NextResponse.json({message: `Request with ID ${id} not found`}, {status: 404});
      }
      return NextResponse.json(formatRequest(updatedRequest), {status: 200});
    }
  }
}