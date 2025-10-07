"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  isOpen: boolean;
  user: { name: string; email?: string };
  onClose: () => void;
}

export default function Sidebar({ isOpen, user, onClose }: SidebarProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />

      <div className="ml-auto w-80 bg-white shadow-xl p-6 relative overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Filters & Status</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All</option>
            <option>COMPLETED</option>
            <option>INCOMPLETE</option>
            <option>MISSING</option>
            <option>PENDING</option>
            <option>APPROVED</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <input
            type="text"
            placeholder="e.g., 01 Jan - 07 Jan"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
