"use client";

import { ItemRequest, RequestStatus } from "@/lib/types/request";

interface RequestTableProps {
  requests: ItemRequest[];
  isLoading: boolean;
  onStatusChange: (id: number, status: RequestStatus) => void;
  selectedRows: Set<number>;
  onRowSelect: (id: number) => void;
  onSelectAll: () => void;
}

const TableHeader = ({
  onSelectAll,
  allSelected,
  multiSelected,
}: {
  onSelectedAll: () => void;
  allSelected: boolean;
  multiSelected: boolean;
}) => (
  <thead className="bg-[#EAECF0] text-xs uppercase text-gray-text">
    <tr>
      <th scope="col" className="p-4">
        <div className="flex items-center">
          <input
            id="checkbox-all-search"
            type="checkbox"
            className="checkbox"
            onChange={onSelectAll}
            checked={allSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = multiSelected && !allSelected;
              }
            }}
          />
          <label htmlFor="checkbox-all-search" className="sr-only">
            Select all items
          </label>
        </div>
      </th>
      <th scope="col" className="px-6 py-3">
        Name
      </th>
      <th scope="col" className="px-6 py-3">
        Item Requested
      </th>
      <th scope="col" className="px-6 py-3">
        Create
      </th>
      <th scope="col" className="px-6 py-3">
        Updated
      </th>
      <th scope="col" className="px-6 py-3">
        Status
      </th>
    </tr>
  </thead>
);

export default function RequestTable({
  requests,
  isLoading,
  onStatusChange,
  selectedRows,
  onRowSelect,
  onSelectAll,
}: RequestTableProps) {
  if (isLoading) {
    return <div className="py-8 text-center text-gray-text"> Loading ...</div>;
  }
  if (!requests || requests.length === 0) {
    return <div className="py-8 text-center text-">No items found</div>;
  }

  const allSelected = selectedRows.size === requests.length;
  const multiSelected = selectedRows.size > 0 && !allSelected;

  return (
    <div className="relative overfolw-x-auto border border-gray-stroke sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-text">
        <TableHeader
          onSelectedAll={onSelectAll}
          allSelected={allSelected}
          multiSelected={multiSelected}
        />
        <tbody>
          {requests.map((request) => (
            //make TableRow.tsx
            <TableRow
              key={request.id}
              request={request}
              onStatusChange={onStatusChange}
              isSelected={selectedRows.has(request.id)}
              onSelect={() => onRowSelect(request.id)}
            ></TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
