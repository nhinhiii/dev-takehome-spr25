export enum RequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  COMPLETED = "completed",
  REJECTED = "rejected",
}

export interface ItemRequest {
  id: number;
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: string;
  lastEditedDate: string | null;
  status: RequestStatus;
}

export interface PaginatedRequest {
  data: ItemRequest[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
