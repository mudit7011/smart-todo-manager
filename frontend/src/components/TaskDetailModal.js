// smart_todo_frontend/src/components/TaskDetailModal.js

"use client";

import React from 'react';

export default function TaskDetailModal({ task, onClose, onMarkDone, onDelete }) {
  if (!task) return null; // Don't render if no task is provided

  const getPriorityLabel = (score) => {
    if (score >= 0.7) return "High";
    if (score >= 0.4) return "Medium";
    return "Low";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-slate-800 break-words pr-8">
            {task.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-lg text-slate-700 whitespace-pre-wrap mb-6">
          {task.description || "No description provided."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 mb-6">
          <p><strong>Category:</strong> <span className="font-semibold text-slate-800">{task.category_name || "None"}</span></p>
          <p><strong>Priority:</strong> <span className="font-semibold text-slate-800">{getPriorityLabel(task.priority_score)}</span></p>
          <p><strong>Deadline:</strong> <span className="font-semibold text-slate-800">{task.deadline ? new Date(task.deadline).toLocaleDateString() : "Not set"}</span></p>
          <p><strong>Status:</strong> <span className="font-semibold text-slate-800 capitalize">{task.status}</span></p>
          <p><strong>Created:</strong> <span className="font-semibold text-slate-800">{new Date(task.created_at).toLocaleString()}</span></p>
          {task.updated_at && <p><strong>Last Updated:</strong> <span className="font-semibold text-slate-800">{new Date(task.updated_at).toLocaleString()}</span></p>}
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-900/10">
          {task.status !== "done" && (
            <button
              onClick={() => onMarkDone(task.id)}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Mark as Done
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}