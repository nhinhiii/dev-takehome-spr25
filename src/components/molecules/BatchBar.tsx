import { RequestStatus } from "@/lib/types/request";
import Dropdown from "../atoms/Dropdown";
import { Trash } from "lucide-react";

interface BatchBarProps {
  onBatchUpdate: (status: RequestStatus) => void;
  onBatchDelete: () => void;
}

const statusOptions = Object.values(RequestStatus).map((status) => ({
  label: status,
  value: status,
}));

export default function BatchBar({
  onBatchUpdate,
  onBatchDelete,
}: BatchBarProps) {
  return (
    <div className="flex items-center justify-between rounded">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-text"> Mark As:</span>
        <Dropdown
          options={statusOptions}
          value={{ label: "Status", value: "" }}
          onChange={(status) => onBatchUpdate(status as RequestStatus)}
        />

        <div className="h-6 w-px bg-gray-stroke mx-2" />

        <button
          className="p-2 rounded-md transition-colors hover:bg-danger-fill hover:text-danger-text text-gray-text"
          onClick={onBatchDelete}
          aria-label="Delete selected items"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
