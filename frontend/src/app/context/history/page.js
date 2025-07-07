"use client";

import { useEffect, useState } from "react";
// Import the new deleteContextEntry function
import { deleteContextEntry } from "@/lib/api";

const mockEntries = [
  { id: 1, content: "Discussed Q4 roadmap...", source_type: "note", timestamp: "2023-10-26T10:00:00.000Z", processed_insights: {} },
  { id: 2, content: "Email from John Doe...", source_type: "email", timestamp: "2023-10-25T15:30:00.000Z", processed_insights: {} },
];

export default function ContextHistoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch entries (can be called again after delete)
  const fetchEntries = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/contexts/");
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Fetched data:', data);
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch context entries", err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // NEW: handleDelete function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this context entry?")) {
      try {
        await deleteContextEntry(id);
        // After successful deletion, re-fetch the entries to update the UI
        fetchEntries();
        alert("Context entry deleted successfully!");
      } catch (error) {
        console.error("Error deleting context entry:", error);
        alert("Failed to delete context entry. Check console for details.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 history-page-bg">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Context History</h1>
          <p className="text-lg text-blue-200 mt-2">A timeline of your captured thoughts and interactions.</p>
        </header>

        {loading ? (
          <p className="text-center text-white/80 text-2xl animate-pulse">Loading history...</p>
        ) : entries.length === 0 ? (
          <div className="text-center bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-semibold text-white">No History Found</h3>
            <p className="text-blue-200 mt-2">Add some context from the 'Add Context' page to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 hover:bg-black/30 hover:border-white/30 relative" // Added 'relative' for button positioning
              >
                <p className="text-gray-200 leading-relaxed">{entry.content}</p>
                <p className="text-sm text-blue-300 mt-4 font-medium">
                  Source: <span className="font-semibold capitalize">{entry.source_type}</span> | Recorded: <span className="font-semibold">{formatDate(entry.timestamp)}</span>
                </p>

                {entry.processed_insights && Object.keys(entry.processed_insights).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <h4 className="text-sm font-semibold text-white mb-2">Processed Insights:</h4>
                    <pre className="bg-black/40 rounded-md p-4 text-cyan-300 font-mono text-xs overflow-x-auto">
                      {JSON.stringify(entry.processed_insights, null, 2)}
                    </pre>
                  </div>
                )}

                {/* NEW: Delete Button */}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-xs transition-colors duration-200"
                  aria-label={`Delete context entry ${entry.id}`}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}