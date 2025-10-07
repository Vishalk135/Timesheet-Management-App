"use client";

import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

interface TaskItemProps {
  task: {
    id: number;
    description: string;
    hours: number;
    project: string;
  };
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

export default function TimesheetDropdownItem({ task, onEdit, onDelete }: TaskItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex justify-between items-center p-2 mb-2 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center flex-grow space-y-1 sm:space-y-0 sm:space-x-2">
        <p className="text-sm text-gray-800">{task.description}</p>
        <span className="text-xs text-gray-500">{task.hours} hrs</span>
        <span className="px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
          {task.project}
        </span>
      </div>

      <div className="relative flex-shrink-0">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                onEdit(task.id);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(task.id);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
