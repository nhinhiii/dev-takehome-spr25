"use client";

import Dropdown from "@/components/atoms/Dropdown";
import { RequestStatus } from "@/lib/types/request";
import { useState } from "react";

const statusOptions = [
  { label: "Pending", value: RequestStatus.PENDING },
  { label: "Approved", value: RequestStatus.APPROVED },
  { label: "Completed", value: RequestStatus.COMPLETED },
  { label: "Rejected", value: RequestStatus.REJECTED },
];

export default function AdminPage() {
  const [currentStatus, setCurrentStatus] = useState(statusOptions[0]);

  const handlerStatusChange = (newValue: string) => {
    const newStatusOption = statusOptions.find(
      (option) => option.value === newValue
    );

    if (newStatusOption) {
      setCurrentStatus(newStatusOption);
    }
  };
  return (
    <div>
      <Dropdown
        options={statusOptions}
        value={currentStatus}
        onChange={handlerStatusChange}
      ></Dropdown>
    </div>
  );
}
