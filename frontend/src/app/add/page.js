"use client";

import { useState } from "react";
import SuggestionPanel from "@/components/SuggestionPanel";
import { getAISuggestions } from "@/lib/api";

export default function AddTaskPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    context: [""],
  });

  const [loading, setLoading] = useState(false);
  const [aiResult, setAIResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContextChange = (index, value) => {
    const updated = [...form.context];
    updated[index] = value;
    setForm((prev) => ({ ...prev, context: updated }));
  };

  const addContextField = () => {
    setForm((prev) => ({ ...prev, context: [...prev.context, ""] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getAISuggestions(form);
      setAIResult(res);
    } catch (err) {
      alert("Failed to get AI suggestions");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Task</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <div>
          <label className="font-medium">Context</label>
          {form.context.map((ctx, i) => (
            <input
              key={i}
              className="w-full border p-2 rounded mt-1 mb-2"
              type="text"
              value={ctx}
              placeholder={`Context ${i + 1}`}
              onChange={(e) => handleContextChange(i, e.target.value)}
            />
          ))}
          <button
            type="button"
            onClick={addContextField}
            className="text-blue-500 hover:underline text-sm"
          >
            + Add More Context
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Get AI Suggestions"}
        </button>
      </form>

      {aiResult && <SuggestionPanel result={aiResult} />}
    </div>
  );
}
