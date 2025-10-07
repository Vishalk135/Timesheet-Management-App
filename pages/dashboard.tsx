"use client";
import { useState } from "react";
import { signOut, getSession } from "next-auth/react";
import useSWR from "swr";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import TimesheetModal, { DayData } from "../component/TimesheetModal";
import { Timesheet, initialTimesheets } from "../data/timesheets";

const fetcher = (url: string) => Promise.resolve(initialTimesheets);

const getStatusBadgeClasses = (status: Timesheet["status"]) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "INCOMPLETE":
      return "bg-yellow-100 text-yellow-700";
    case "MISSING":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

interface DashboardProps {
  user: { name: string; email?: string };
}

export default function Dashboard({ user }: DashboardProps) {
  const { data: timesheets, mutate, error } = useSWR<Timesheet[]>("/api/timesheets", fetcher);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Timesheet | null>(null);
  const [sortColumn, setSortColumn] = useState<"week" | "date" | "status">("week");
  const [sortAsc, setSortAsc] = useState(true);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleEdit = (item: Timesheet) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const modalData: DayData[] = editItem
    ? [
        {
          date: editItem.dateRange,
          tasks: [
            {
              id: editItem.id,
              description: editItem.description,
              hours: editItem.hours ?? 0,
              project: editItem.project ?? "Project Name",
            },
          ],
        },
      ]
    : [];

  const handleSave = (updatedData: DayData[]) => {
    if (!timesheets) return;
    const newTimesheets = timesheets.map((t) => {
      if (editItem && t.id === editItem.id) {
        const day = updatedData.find((d) => d.date === t.dateRange);
        if (!day || day.tasks.length === 0) return t;
        const task = day.tasks[0];
        return {
          ...t,
          description: task.description,
          hours: task.hours,
          project: task.project,
        };
      }
      return t;
    });
    mutate(newTimesheets, false);
    setIsModalOpen(false);
  };

  const handleSort = (column: "week" | "date" | "status") => {
    if (sortColumn === column) setSortAsc(!sortAsc);
    else {
      setSortColumn(column);
      setSortAsc(true);
    }
  };

  if (error)
    return <div className="p-4 md:p-8 text-red-600 text-center text-sm md:text-base">Error loading timesheets.</div>;
  if (!timesheets)
    return <div className="p-4 md:p-8 text-gray-500 text-center text-sm md:text-base">Loading timesheets...</div>;

  let filteredTimesheets = timesheets.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (dateRangeFilter) {
      const [from, to] = dateRangeFilter.split(" - ");
      const [start, end] = t.dateRange.split(" - ");
      if (from && new Date(start) < new Date(from)) return false;
      if (to && new Date(end) > new Date(to)) return false;
    }
    return true;
  });

  filteredTimesheets.sort((a, b) => {
    let valA: any, valB: any;
    switch (sortColumn) {
      case "week":
        valA = a.week;
        valB = b.week;
        break;
      case "date":
        valA = new Date(a.dateRange.split(" - ")[0]).getTime();
        valB = new Date(b.dateRange.split(" - ")[0]).getTime();
        break;
      case "status":
        valA = a.status;
        valB = b.status;
        break;
    }
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filteredTimesheets.length / itemsPerPage);
  const paginatedTimesheets = filteredTimesheets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header userName={user.name} onLogout={() => signOut({ callbackUrl: "/login" })} />

      <div className="flex flex-col md:flex-row relative flex-grow">
        <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 bg-white rounded-t-xl md:rounded-xl shadow-xl overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6">
            Your Timesheets
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative">
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 text-xs sm:text-sm"
              >
                Date Range
              </button>
              {showDateFilter && (
                <div className="absolute top-full mt-2 w-52 sm:w-60 bg-white border rounded shadow-lg z-50 p-3 sm:p-4">
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">Select date range</p>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD - YYYY-MM-DD"
                    value={dateRangeFilter}
                    onChange={(e) => setDateRangeFilter(e.target.value)}
                    className="border rounded w-full px-2 py-1 text-xs sm:text-sm mb-2"
                  />
                  <button
                    onClick={() => setShowDateFilter(false)}
                    className="bg-gray-800 text-white px-3 py-1 rounded text-xs sm:text-sm w-full"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowStatusFilter(!showStatusFilter)}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 text-xs sm:text-sm"
              >
                Status
              </button>
              {showStatusFilter && (
                <div className="absolute top-full mt-2 w-44 sm:w-48 bg-white border rounded shadow-lg z-50 p-3 sm:p-4">
                  <p className="text-gray-400 text-xs sm:text-sm mb-2">Select status</p>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded w-full px-2 py-1 text-xs sm:text-sm mb-2"
                  >
                    <option value="">All</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="INCOMPLETE">INCOMPLETE</option>
                    <option value="MISSING">MISSING</option>
                  </select>
                  <button
                    onClick={() => setShowStatusFilter(false)}
                    className="bg-gray-800 text-white px-3 py-1 rounded text-xs sm:text-sm w-full"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-xs sm:text-sm md:text-base">
              <thead className="text-gray-600 bg-gray-100">
                <tr>
                  <th className="p-3 cursor-pointer" onClick={() => handleSort("week")}>
                    Week # {sortColumn === "week" ? (sortAsc ? "↑" : "↓") : ""}
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => handleSort("date")}>
                    Date {sortColumn === "date" ? (sortAsc ? "↑" : "↓") : ""}
                  </th>
                  <th className="p-3 cursor-pointer" onClick={() => handleSort("status")}>
                    Status {sortColumn === "status" ? (sortAsc ? "↑" : "↓") : ""}
                  </th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedTimesheets.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-900">{item.week}</td>
                    <td className="p-3 text-gray-700">{item.dateRange}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadgeClasses(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-between items-center mt-4 text-xs sm:text-sm">
            <div className="text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-1 mt-2 sm:mt-0">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 border rounded ${
                    page === currentPage ? "bg-gray-800 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-xs sm:text-sm mt-6 md:mt-8">
            © 2024 Tentwenty. All rights reserved.
          </div>
        </div>

        <Sidebar isOpen={isSidebarOpen} user={user} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Modal */}
      <TimesheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={modalData}
        onSave={handleSave}
      />
    </div>
  );
}

// Authentication
export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: "/login", permanent: false } };
  return { props: { user: session.user } };
}
