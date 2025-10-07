"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, X } from "lucide-react";

export interface Task {
  id: number;
  description: string;
  hours: number;
  project: string;
}

export interface DayData {
  date: string;
  tasks: Task[];
}

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: DayData[];
  onSave: (data: DayData[]) => void;
}

export default function TimesheetModal({ isOpen, onClose, initialData, onSave }: TimesheetModalProps) {
  const [data, setData] = useState<DayData[]>(initialData);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleAddTask = (date: string) => {
    setData((prev) =>
      prev.map((day) =>
        day.date === date
          ? {
              ...day,
              tasks: [
                ...day.tasks,
                { id: Date.now(), description: "New Task", hours: 0, project: "Project Name" },
              ],
            }
          : day
      )
    );
  };

  const handleEditTask = (date: string, taskId: number, field: keyof Task, value: string | number) => {
    setData((prev) =>
      prev.map((day) =>
        day.date === date
          ? {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId ? { ...task, [field]: value } : task
              ),
            }
          : day
      )
    );
  };

  const handleDeleteTask = (date: string, taskId: number) => {
    setData((prev) =>
      prev.map((day) =>
        day.date === date
          ? { ...day, tasks: day.tasks.filter((t) => t.id !== taskId) }
          : day
      )
    );
  };

  const totalHours = data.reduce(
    (sum, day) => sum + day.tasks.reduce((t, task) => t + task.hours, 0),
    0
  );
  const maxHours = 40;
  const progressPercent = Math.min((totalHours / maxHours) * 100, 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-start pt-24 z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[80vh] relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">This Week's Timesheet</h2>
          <div className="text-sm text-gray-600">
            {totalHours}/{maxHours} hrs
            <div className="w-32 h-2 bg-gray-200 rounded mt-1 overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {data.map((day) => (
            <div key={day.date} className="border-b pb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">{day.date}</p>

              <div className="space-y-2">
                {day.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border px-3 py-2 rounded hover:shadow-sm transition relative"
                  >
                    {editTaskId === task.id ? (
                      <>
                        <input
                          type="text"
                          value={task.description}
                          onChange={(e) =>
                            handleEditTask(day.date, task.id, "description", e.target.value)
                          }
                          className="flex-1 bg-transparent outline-none text-gray-800 mr-2"
                        />
                        <input
                          type="number"
                          value={task.hours}
                          onChange={(e) =>
                            handleEditTask(day.date, task.id, "hours", Number(e.target.value))
                          }
                          className="w-16 text-right bg-transparent outline-none text-gray-600 mr-2"
                        />
                        <input
                          type="text"
                          value={task.project}
                          onChange={(e) =>
                            handleEditTask(day.date, task.id, "project", e.target.value)
                          }
                          className="bg-transparent outline-none text-blue-500 text-sm font-medium mr-2"
                        />
                        <button
                          onClick={() => setEditTaskId(null)}
                          className="text-green-600 text-sm hover:underline"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="text-gray-800">{task.description}</p>
                          <p className="text-gray-500 text-sm">{task.hours} hrs | {task.project}</p>
                        </div>

                        <div className="relative">
                          <button
                            onClick={() => setMenuOpenId(menuOpenId === task.id ? null : task.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {menuOpenId === task.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg z-50 w-24">
                              <button
                                onClick={() => {
                                  setEditTaskId(task.id);
                                  setMenuOpenId(null);
                                }}
                                className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteTask(day.date, task.id);
                                  setMenuOpenId(null);
                                }}
                                className="w-full text-left px-3 py-1 hover:bg-gray-100 text-red-600 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-2">
                <button
                  onClick={() => handleAddTask(day.date)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  + Add new task
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button onClick={onClose} className="px-4 py-1 border rounded hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={() => {
              setEditTaskId(null);
              onSave(data);
            }}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save All
          </button>
        </div>
      </div>
    </div>
  );
}
