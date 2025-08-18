"use client";

import { PaginatedRequest, RequestStatus } from "@/lib/types/request";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const fetchRequests = async (
  page: number,
  status: string
): Promise<PaginatedRequest> => {
  const params = new URLSearchParams({ page: page.toString() });
  if (status !== "all") {
    params.append("status", status);
  }

  const response = await fetch(`api/mock/request?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch requests.");
  }

  return response.json();
};

const updateRequestStatus = async ({
  id,
  status,
}: {
  id: number;
  status: RequestStatus;
}) => {
  const response = await fetch(`api/mock/request`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });

  return response.json();
};

const StatusTab = ({
  label,
  value,
  activeTab,
  onClick,
}: {
  label: string;
  value: string;
  activeTab: string;
  onClick: (status: string) => void;
}) => (
  <button
    onClick={() => onClick(value)}
    className={`status-badge ${
      activeTab === value ? "status-badge-active" : "status-badge-inactive"
    }`}
  >
    {label}
  </button>
);

export default function ItemRequestsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [activeStatusTab, setActiveStatusTab] = useState("all");
  const [selectedRows, setSelectedRows] = useState(new Set<number>());

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedRequest, Error>({
    queryKey: ["requests", page, activeStatusTab],
    queryFn: () => fetchRequests(page, activeStatusTab),
  });
}
