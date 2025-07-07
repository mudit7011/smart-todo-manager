// smart_todo_frontend/src/app/page.js

"use client";

import { useEffect, useState } from "react";
// No longer need Link from 'next/link' for this approach
import { getAllTasks, updateTaskStatus, deleteTask, getTaskById } from "@/lib/api"; // Import getTaskById
import TaskDetailModal from "@/components/TaskDetailModal"; // Import the new modal component

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null); // State to hold the task for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  function notifyDueTasks(tasks) {
    if (!("Notification" in window)) return;
    const now = new Date();
    const inOneDay = new Date();
    inOneDay.setDate(now.getDate() + 1);

    tasks.forEach((task) => {
      if (!task.deadline || task.status === "done") return;
      const due = new Date(task.deadline);

      if (due > now && due <= inOneDay) {
        new Notification("🔔 Task Reminder", {
          body: `Your task "${task.title}" is due soon!`,
        });
      }
    });
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getAllTasks();
        setTasks(data);
        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }
        if (Notification.permission === "granted") {
          notifyDueTasks(data);
        }
      } catch (err) {
        console.error("Error loading tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Handler for opening the detail modal
  const handleTaskCardClick = async (taskId) => {
    try {
      setLoading(true); // Show loading while fetching single task details
      const taskDetails = await getTaskById(taskId); // Fetch full details
      setSelectedTask(taskDetails);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching task details for modal:", err);
      // Handle error, maybe show a toast message
    } finally {
      setLoading(false);
    }
  };

  // Handler for closing the detail modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    // Optionally re-fetch all tasks to ensure latest status if modal actions are not optimistically updated on dashboard
    // fetchTasks();
  };


  const handleMarkDone = async (taskId) => {
    try {
      // Optimistic update for dashboard view
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "done" } : task)));
      // Also update the selectedTask if the modal is open for this task
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, status: "done" });
      }
      await updateTaskStatus(taskId, { status: "done" });
    } catch (err) {
      console.error("Error marking done:", err);
      const originalTasks = await getAllTasks();
      setTasks(originalTasks);
      // Revert selectedTask if error
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(originalTasks.find(t => t.id === taskId) || null);
      }
    }
  };

  const handleDelete = async (taskId) => {
    try {
      // Optimistic update for dashboard view
      setTasks(tasks.filter((t) => t.id !== taskId));
      // Close modal if deleted task was the one being viewed
      if (selectedTask && selectedTask.id === taskId) {
        handleCloseModal();
      }
      await deleteTask(taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
      const originalTasks = await getAllTasks();
      setTasks(originalTasks);
      // No revert needed for selectedTask if it's already closed/filtered out
    }
  };

  const getPriorityInfo = (score) => {
    if (score >= 0.7) {
      return { label: "High", className: "bg-red-100 text-red-800" };
    }
    if (score >= 0.4) {
      return { label: "Medium", className: "bg-yellow-100 text-yellow-800" };
    }
    return { label: "Low", className: "bg-green-100 text-green-800" };
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 animated-gradient-bg">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
            Task Dashboard
          </h1>
          <p className="text-lg text-slate-600 mt-2">
            A fresh and clear view of your goals.
          </p>
        </header>

        {loading ? (
          <div className="text-center text-slate-700">
            <p className="text-2xl animate-pulse">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center bg-white/40 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-lg">
            <h3 className="text-2xl font-semibold text-slate-800">All clear!</h3>
            <p className="text-slate-600 mt-2">No tasks found. Enjoy the peace or add a new one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const priority = getPriorityInfo(task.priority_score);
              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskCardClick(task.id)} // Click handler to open modal
                  className={`
                    bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg
                    transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-xl hover:bg-white/50
                    flex flex-col justify-between p-6 cursor-pointer // Add cursor-pointer
                    ${task.status === "done" ? "opacity-60" : ""}
                  `}
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className={`font-bold text-xl text-slate-800 ${task.status === "done" ? "line-through" : ""}`}>
                        {task.title}
                      </h2>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${priority.className}`}>
                        {priority.label}
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm mb-4 h-12 overflow-hidden">
                      {task.description}
                    </p>
                    <div className="text-xs text-slate-500 border-t border-slate-900/10 pt-3">
                      <p>Category: <span className="font-semibold text-slate-600">{task.category_name || "None"}</span></p>
                      <p>Status: <span className="font-semibold text-slate-600 capitalize">{task.status}</span></p>
                    </div>
                  </div>
                  {/* Buttons remain, handle clicks directly and stop propagation */}
                  <div className="mt-6 flex gap-3" onClick={(e) => e.stopPropagation()}>
                    {task.status !== "done" ? (
                      <button
                        onClick={() => handleMarkDone(task.id)}
                        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                      >
                        Mark as Done
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Render the modal if isModalOpen is true */}
        {isModalOpen && (
          <TaskDetailModal
            task={selectedTask}
            onClose={handleCloseModal}
            onMarkDone={handleMarkDone} // Pass handlers to the modal for actions
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}