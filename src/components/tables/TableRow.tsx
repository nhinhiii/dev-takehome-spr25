"use client";

import { ItemRequest, RequestStatus } from "@/lib/types/request";
import { cn, formatDate } from "@/lib/utils";
import Dropdown from "../atoms/Dropdown";

interface TableRowProps {
  request: ItemRequest;
  onStatusChange: (id: number, status: RequestStatus) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const statusOptions = Object.values(RequestStatus).map((status) => ({
  label: status,
  value: status,
}));

export default function TableRow({
  request,
  onStatusChange,
  isSelected,
  onSelect,
}: TableRowProps) {
  const {
    id,
    requestorName,
    itemRequested,
    requestCreatedDate,
    lastEditedDate,
    status,
  } = request;

  const handleDropdownChange = (newStatus: string) => {
    onStatusChange(id, newStatus as RequestStatus);
  };

  return (
    <tr
      className={cn(
        "border-b bg-white hover:bg-gray-fill",
        isSelected && "row-selected"
      )}
    >
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            className="checkbox"
            id={`checkbox-table-${id}`}
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
          />
          <label htmlFor={`checkbox-table-${id}`} className="sr-only">
            Select item {id}
          </label>
        </div>
      </td>

      <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium">
        {requestorName}
      </th>

      <td className={cn("px-6 py-4", isSelected && "text-gray-text")}>
        {itemRequested}
      </td>

      <td className="px-6 py-4"> {formatDate(requestCreatedDate)}</td>
      <td className="px-6 py-4">
        {formatDate(lastEditedDate ?? requestCreatedDate)}
      </td>

      <td className="px-6 py-4">
        <Dropdown
          options={statusOptions}
          value={{ label: status, value: status }}
          onChange={handleDropdownChange}
        />
      </td>
    </tr>
  );
}
