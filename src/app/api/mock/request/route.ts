import { ResponseType } from "@/lib/types/apiResponse";
import { RequestStatus } from "@/lib/types/request";
import mockItemRequests from "../data";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") as RequestStatus | null;
    const page = parseInt(url.searchParams.get("page") || "1");

    const filteredData =
      status && status !== "all"
        ? mockItemRequests.filter((item) => item.status === status)
        : [...mockItemRequests];

    filteredData.sort(
      (a, b) => b.requestCreatedDate.getTime() - a.requestCreatedDate.getTime()
    );
    const totalRecords = filteredData.length;

    const startIdx = (page - 1) * PAGINATION_PAGE_SIZE;
    const endIdx = startIdx + PAGINATION_PAGE_SIZE;
    const paginatedItems = filteredData.slice(startIdx, endIdx);

    const responsePayLoad = {
      data: paginatedItems,
      page: page,
      totalRecords: totalRecords,
      pageSize: PAGINATION_PAGE_SIZE,
    };

    return NextResponse.json(responsePayLoad, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "An unknow error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: "Invalid Input! ID and status are required" },
        { status: 400 }
      );
    }

    const itemIdx = mockItemRequests.findIndex((item) => item.id === id);

    if (itemIdx === -1) {
      return NextResponse.json(
        { message: `Item with ID ${id} not found.` },
        { status: 404 }
      );
    }

    mockItemRequests[itemIdx].status = status;
    mockItemRequests[itemIdx].lastEditedDate = new Date();

    return NextResponse.json(mockItemRequests[itemIdx], { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "An unknown error occured." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { requestorName, itemRequested } = await request.json();

    if (!requestorName || !itemRequested) {
      return NextResponse.json(
        {
          message:
            "Invalid input: requestorName and itemRequested are required.",
        },
        { status: 400 }
      );
    }

    const newId = Math.max(...mockItemRequests.map((item) => item.id)) + 1;

    const newRequest = {
      id: newId,
      requestorName,
      itemRequested,
      requestCreatedDate: new Date(),
      lastEditedDate: new Date(),
      status: RequestStatus.PENDING,
    };

    mockItemRequests.push(newRequest);

    return NextResponse.json(newRequest, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { message: "An unknow error occured" },
      { status: 500 }
    );
  }
}
