"use client";

import Pagination from "@/components/molecules/Pagination";
import RequestsTable from "@/components/tables/RequestTable";
import { PaginatedRequest, RequestStatus } from "@/lib/types/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const fetchRequests = async (
  page: number,
  status: string
): Promise<PaginatedRequest> => {
  const params = new URLSearchParams({ page: page.toString() });
  if (status !== "all") {
    params.append("status", status);
  }

  const response = await fetch(`/api/mock/request?${params.toString()}`);

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
  const response = await fetch(`/api/mock/request`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to updated Status");
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

  const mutation = useMutation({
    mutationFn: updateRequestStatus,
    onMutate: async (updatedRequest) => {
      await queryClient.cancelQueries({ queryKey: ["requests"] });
      const previousData = queryClient.getQueryData<PaginatedRequest>([
        "requests",
        page,
        activeStatusTab,
      ]);
      queryClient.setQueryData<PaginatedRequest>(
        ["requests", page, activeStatusTab],
        (oldData) => {
          if (!oldData) return undefined;
          return {
            ...oldData,
            data: oldData.data.map((req) =>
              req.id === updatedRequest.id
                ? { ...req, status: updatedRequest.status }
                : req
            ),
          };
        }
      );
      return { previousData };
    },

    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["requests", page, activeStatusTab],
          context.previousData
        );
      }
      toast.error(`Error: ${err.message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["requests", page, activeStatusTab],
      });
    },

    onSuccess: () => {
      toast.success("Status updated!");
    },
  });

  const handleStatusChange = (id: number, status: RequestStatus) => {
    mutation.mutate({ id, status });
  };

  const handleTabClick = (status: string) => {
    setActiveStatusTab(status);
    setPage(1);
    setSelectedRows(new Set());
  };

  const handleRowSelect = (id: number) => {
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

  const requests = paginatedData?.data ?? [];
  const totalRecords = paginatedData?.totalRecords ?? 0;
  const pageSize = paginatedData?.pageSize ?? 10;

  return (
    <>
      <Toaster position="top-center" />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-text-strong">
              Item Requests
            </h1>
          </header>

          <div className="rounded-lg bg-white p-6 shadow-sm">
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
