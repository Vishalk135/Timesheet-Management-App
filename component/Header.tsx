"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import TimesheetModal, { DayData } from "./TimesheetModal";

interface HeaderProps {
  userName: string;
  userEmail?: string;
  onLogout: () => void;
}

export default function Header({ userName, userEmail, onLogout }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const initialData: DayData[] = [
    { date: "2024-01-01", tasks: [{ id: 1, description: "Design Homepage", hours: 4, project: "Web App" }] },
    { date: "2024-01-02", tasks: [{ id: 2, description: "Develop Login", hours: 5, project: "Web App" }] },
    { date: "2024-01-03", tasks: [] },
    { date: "2024-01-04", tasks: [] },
    { date: "2024-01-05", tasks: [] },
  ];

  const filteredData = initialData.filter((day) => {
    const dayDate = new Date(day.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from && dayDate < from) return false;
    if (to && dayDate > to) return false;
    return true;
  });

  const totalHours = filteredData.reduce(
    (sum, day) => sum + day.tasks.reduce((t, task) => t + task.hours, 0),
    0
  );

  return (
    <header className="bg-white shadow px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center relative">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-gray-800">ticktock</h1>
        <h2
          onClick={() => setIsTimesheetModalOpen(true)}
          className="text-xl font-semibold text-gray-800 cursor-pointer flex items-center gap-1"
        >
          Timesheet <ChevronDown size={16} />
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition flex items-center gap-1"
        >
          {userName} <ChevronDown size={16} />
        </button>

        {showProfileDropdown && (
          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border rounded-lg shadow-lg z-50 p-4 text-sm">
            <p className="font-medium text-gray-800">{userName}</p>
            {userEmail && <p className="text-gray-500 mb-2">{userEmail}</p>}

            <div className="mt-2">
              <p className="text-gray-500 mb-1">Filter by Date:</p>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border rounded px-2 py-1 w-1/2 text-sm"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border rounded px-2 py-1 w-1/2 text-sm"
                />
              </div>
            </div>

            <div className="mt-3">
              <p className="text-gray-500 mb-1">Hours Worked:</p>
              {filteredData.length > 0 ? (
                filteredData.map((day) => {
                  const dayHours = day.tasks.reduce((t, task) => t + task.hours, 0);
                  return (
                    <p key={day.date} className="text-gray-700">
                      {day.date}: {dayHours} hrs
                    </p>
                  );
                })
              ) : (
                <p className="text-gray-400">No tasks in this range</p>
              )}
              <p className="mt-1 font-medium text-gray-800">
                Total: {totalHours} hrs
              </p>
            </div>

            <button
              onClick={onLogout}
              className="mt-4 w-full bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <TimesheetModal
        isOpen={isTimesheetModalOpen}
        onClose={() => setIsTimesheetModalOpen(false)}
        initialData={initialData}
        onSave={(data) => console.log("Saved timesheet:", data)}
      />
    </header>
  );
}
