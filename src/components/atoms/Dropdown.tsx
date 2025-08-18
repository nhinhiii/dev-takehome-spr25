"use client";

import { RequestStatus } from "@/lib/types/request";
import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import { Fragment } from "react";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: DropdownOption;
  onChange: (value: string) => void;
}

const statusPillsMap: Record<string, string> = {
  [RequestStatus.PENDING]: "status-pills-pending",
  [RequestStatus.APPROVED]: "status-pills-approved",
  [RequestStatus.COMPLETED]: "status-pills-completed",
  [RequestStatus.REJECTED]: "status-pills-rejected",
};

export default function Dropdown({ options, value, onChange }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left w-32">
      <div>
        <Menu.Button
          className={cn(
            "status-pills w-full justify-between transition-colors",
            statusPillsMap[value.value] || "status-pills-pending"
          )}
        >
          <span>{value.label}</span>
          <ChevronDownIcon className="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-110"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-full origin-top-right rounded-b-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="px-1 py-1">
            {options.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => onChange(option.value)}
                    className={cn(
                      "group flex items-center rounded-full px-3 py-1 text-sm",
                      active
                        ? cn("status-pills", statusPillsMap[option.value])
                        : "text-gray-900"
                    )}
                  >
                    <span className="capitalize">{option.label}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
