"use client";

import { useState, useEffect, useRef } from "react";
import { createTask, getAISuggestions, getCategories } from "@/lib/api";
import SuggestionPanel from "@/components/SuggestionPanel";

const SpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function AddTaskPage() {
  const [form, setForm] = useState({ title: "", description: "", deadline: "" });
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const descriptionEditedRef = useRef(false);
  const deadlineEditedRef = useRef(false);

  // NEW STATE: To store all fetched context entries
  const [allContextEntries, setAllContextEntries] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // NEW: Fetch all context entries
        const res = await fetch("http://127.0.0.1:8000/api/contexts/");
        if (!res.ok) {
          throw new Error(`Failed to fetch context entries: ${res.status} ${res.statusText}`);
        }
        const contextData = await res.json();
        // Map to get only the content strings, as expected by your backend
        const contentStrings = contextData.map(entry => entry.content);
        setAllContextEntries(contentStrings);
        console.log("Fetched all context entries for AI:", contentStrings); // For debugging
      } catch (error) {
        console.error("Error loading initial data (categories or contexts):", error);
      }
    };
    fetchInitialData();
  }, []); // Empty dependency array means this runs once on mount

  const handleAISuggestions = async (currentTitle) => {
    if (!currentTitle.trim()) {
      setSuggestions(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSuggestions(null);

    try {
      // MODIFIED LINE: Use the dynamically fetched allContextEntries
      const suggestionData = await getAISuggestions({ title: currentTitle, context: allContextEntries });

      setSuggestions(suggestionData);
      setForm((prev) => {
        const newForm = { ...prev };
        if (suggestionData.enhanced_description && !descriptionEditedRef.current) {
          newForm.description = suggestionData.enhanced_description;
        }
        if (suggestionData.suggested_deadline && !deadlineEditedRef.current) {
          newForm.deadline = suggestionData.suggested_deadline;
        }
        return newForm;
      });
    } catch (error) {
      console.error("AI suggestion failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setForm((prev) => ({ ...prev, title: newTitle }));
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      handleAISuggestions(newTitle);
    }, 500);
  };

  const handleDescriptionChange = (e) => {
    setForm({ ...form, description: e.target.value });
    descriptionEditedRef.current = true;
  };

  const handleDeadlineChange = (e) => {
    setForm({ ...form, deadline: e.target.value });
    deadlineEditedRef.current = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskPayload = {
        title: form.title,
        description: form.description,
        category: suggestions?.suggested_category_id,
        priority_score: suggestions?.priority_score || 0.5,
        deadline: form.deadline || null,
      };

      if (taskPayload.category === undefined || taskPayload.category === null) {
          console.warn("No AI category suggested or mapped, defaulting to Personal.");
          const personalCategory = categories.find(cat => cat.name.toLowerCase() === 'personal');
          if (personalCategory) {
              taskPayload.category = personalCategory.id;
          } else {
              alert("Error: No category could be assigned. Please ensure 'Personal' category exists.");
              return;
          }
      }

      await createTask(taskPayload);
      alert("Task created successfully!");
      setForm({ title: "", description: "", deadline: "" });
      setSuggestions(null);
      descriptionEditedRef.current = false;
      deadlineEditedRef.current = false;
    } catch (err) {
      console.error("Failed to create task:", err);
      alert("Failed to create task. Check console for details.");
    }
  };

  const inputStyle = "w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg p-3 text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition-all duration-200";

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 add-task-bg flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
            Create a New Task
          </h1>
          <p className="text-lg text-yellow-900/80 mt-2">
            Type your task title, and AI will suggest details. You can always refine them!
          </p>
        </header>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl p-8"
        >
          <input
            type="text"
            placeholder="Task Title (e.g., Prepare presentation)"
            className={inputStyle}
            value={form.title}
            onChange={handleTitleChange}
            required
          />
          <textarea
            placeholder="Description..."
            className={`${inputStyle} min-h-[120px]`}
            value={form.description}
            onChange={handleDescriptionChange}
          ></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="date"
              className={inputStyle}
              value={form.deadline}
              onChange={handleDeadlineChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-yellow-900/20">
            {loading && (
              <div className="w-full sm:w-auto flex-grow flex items-center justify-center text-amber-500 font-semibold px-6 py-3">
                <SpinnerIcon />
                Analyzing...
              </div>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-amber-800 transform hover:scale-105 transition-all duration-300"
            >
              Add Task
            </button>
          </div>
        </form>
        {suggestions && (
          <div className="mt-8">
            <SuggestionPanel result={suggestions} categories={categories} />
          </div>
        )}
      </div>
    </div>
  );
}