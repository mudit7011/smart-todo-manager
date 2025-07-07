"use client";

import { useState, useEffect } from "react";
// Your real API import
import { postContextEntry } from "@/lib/api";

// Helper icons for better visual feedback
const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export default function ContextPage() {
  const [content, setContent] = useState("");
  const [sourceType, setSourceType] = useState("note");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // This effect will make the success message disappear after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false); // Reset success state on new submission
    try {
      await postContextEntry({ content, source_type: sourceType });
      setSuccess(true);
      setContent("");
    } catch (error) {
      console.error(error);
      alert("Failed to submit context");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:outline-none transition-all duration-200";

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 context-page-bg flex items-center justify-center">
      <div className="w-full max-w-xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.05)' }}>
            Add Daily Context
          </h1>
          <p className="text-lg text-slate-600 mt-2">
            Capture your thoughts, emails, or messages.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl p-8"
        >
          <textarea
            className={`${inputStyle} min-h-[160px]`}
            placeholder="What's on your mind? Paste notes, messages, or email text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-grow">
                <label htmlFor="sourceType" className="block text-sm font-medium text-slate-600 mb-2">Source</label>
                <select id="sourceType" className={inputStyle} value={sourceType} onChange={(e) => setSourceType(e.target.value)}>
                    <option value="note">Note</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                </select>
            </div>

            <div className="w-full sm:w-auto self-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                    >
                    {loading && <SpinnerIcon />}
                    {loading ? "Submitting..." : "Submit Context"}
                </button>
            </div>
          </div>
          
          {success && (
            <div className="flex items-center p-4 bg-green-100/70 text-green-800 rounded-lg border border-green-200">
              <CheckCircleIcon />
              <p className="font-semibold">Context added successfully!</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}