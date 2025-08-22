"use client";

import BatchBar from "@/components/molecules/BatchBar";
import Pagination from "@/components/molecules/Pagination";
import RequestsTable from "@/components/tables/RequestTable";
import { PaginatedRequest, RequestStatus } from "@/lib/types/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const API_ENDPOINT = "/api/request";

const fetchRequests = async (
  page: number,
  status: string
): Promise<PaginatedRequest> => {
  const params = new URLSearchParams({ page: page.toString() });
  if (status !== "all") {
    params.append("status", status);
  }

  const fetchUrl = `${API_ENDPOINT}?${params.toString()}`;

  console.log("Attempting to fetch from URL:", fetchUrl);

  const response = await fetch(fetchUrl);

  if (!response.ok) {
    console.error(
      "Fetch failed with status:",
      response.status,
      response.statusText
    );
    const responseText = await response.text();
    console.error("Response body:", responseText);

    try {
      const errorData = JSON.parse(responseText);
      throw new Error(errorData.message || "Failed to fetch requests.");
    } catch (e) {
      throw new Error(
        `The server returned a non-JSON response (Status: ${response.status}). Check the file path of your API route.`
      );
    }
  }

  return response.json();
};

const updateRequestStatus = async ({
  id,
  status,
}: {
  id: string;
  status: RequestStatus;
}) => {
  const response = await fetch(API_ENDPOINT, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update status.");
  }
  return response.json();
};
const batchUpdateRequestStatus = async (variables: {
  ids: string[];
  status: RequestStatus;
}) => {
  const response = await fetch(API_ENDPOINT, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to batch update statuses.");
  }
  return response.json();
};
const batchDeleteRequests = async (variables: { ids: string[] }) => {
  const response = await fetch(API_ENDPOINT, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete requests.");
  }
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
  const [selectedRows, setSelectedRows] = useState(new Set<string>());

  const queryKey = ["requests", page, activeStatusTab];

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedRequest, Error>({
    queryKey,
    queryFn: () => fetchRequests(page, activeStatusTab),
  });

  const singleUpdateMutation = useMutation({
    mutationFn: updateRequestStatus,
    onSuccess: () => {
      toast.success("Status updated!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const batchUpdateMutation = useMutation({
    mutationFn: batchUpdateRequestStatus,
    onSuccess: (data) => {
      toast.success(data.message || "Batch update successful!");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      setSelectedRows(new Set());
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const batchDeleteMutation = useMutation({
    mutationFn: batchDeleteRequests,
    onSuccess: (data) => {
      toast.success(data.message || "Items deleted!");
      setSelectedRows(new Set());
      if (page > 1 && selectedRows.size === (paginatedData?.data.length || 0)) {
        setPage(page - 1);
      } else {
        queryClient.invalidateQueries({ queryKey: ["requests"] });
      }
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const handleStatusChange = (id: string, status: RequestStatus) => {
    singleUpdateMutation.mutate({ id, status });
  };

  const handleTabClick = (status: string) => {
    setActiveStatusTab(status);
    setPage(1);
    setSelectedRows(new Set());
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === (paginatedData?.data.length || 0)) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData?.data.map((r) => r.id) || []));
    }
  };

  const handleBatchUpdate = (status: RequestStatus) => {
    if (selectedRows.size === 0) {
      toast.error("Please select items to update.");
      return;
    }
    const ids = Array.from(selectedRows);
    batchUpdateMutation.mutate({ ids, status });
  };

  const handleBatchDelete = () => {
    if (selectedRows.size === 0) {
      toast.error("Please select items to delete.");
      return;
    }
    toast(
      (t) => (
        <span className="flex flex-col items-center gap-2">
          <b>Delete {selectedRows.size} items?</b>
          <div className="flex gap-2">
            <button
              className="rounded-md bg-danger-bg px-3 py-1 text-sm text-white hover:bg-danger-bg-hover"
              onClick={() => {
                const ids = Array.from(selectedRows);
                batchDeleteMutation.mutate({ ids });
                toast.dismiss(t.id);
              }}
            >
              Confirm
            </button>
            <button
              className="rounded-md bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 6000 }
    );
  };

  const requests = paginatedData?.data ?? [];
  const totalRecords = paginatedData?.totalRecords ?? 0;
  const pageSize = paginatedData?.pageSize ?? 10;

  return (
    <>
      <Toaster position="top-center" />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="flex items-center justify-between my-6">
            <h1 className="text-2xl font-bold text-gray-text-strong">
              Item Requests
            </h1>
            <BatchBar
              onBatchUpdate={handleBatchUpdate}
              onBatchDelete={handleBatchDelete}
            />
          </header>
          <div className="rounded-lg bg-white p-10 shadow-sm">
            <div className="mb-4 flex space-x-2">
              <StatusTab
                label="All"
                value="all"
                activeTab={activeStatusTab}
                onClick={handleTabClick}
              />
              <StatusTab
                label="Pending"
                value="pending"
                activeTab={activeStatusTab}
                onClick={handleTabClick}
              />
              <StatusTab
                label="Approved"
                value="approved"
                activeTab={activeStatusTab}
                onClick={handleTabClick}
              />
              <StatusTab
                label="Completed"
                value="completed"
                activeTab={activeStatusTab}
                onClick={handleTabClick}
              />
              <StatusTab
                label="Rejected"
                value="rejected"
                activeTab={activeStatusTab}
                onClick={handleTabClick}
              />
            </div>
            {isError && (
              <div className="py-8 text-center text-danger-text">
                <p>Error: {error.message}</p>
              </div>
            )}
            {!isError && (
              <>
                <RequestsTable
                  requests={requests}
                  isLoading={isLoading}
                  onStatusChange={handleStatusChange}
                  selectedRows={selectedRows}
                  onRowSelect={handleRowSelect}
                  onSelectAll={handleSelectAll}
                />
                <footer className="mt-4 flex justify-end">
                  <Pagination
                    pageNumber={page}
                    pageSize={pageSize}
                    totalRecords={totalRecords}
                    onPageChange={setPage}
                  />
                </footer>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
