import React from 'react';

export default function SuggestionPanel({ result, categories }) {
  const contextualSuggestions = result?.contextual_suggestions || [];

  return (
    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Suggestions</h3>

      <p><strong>Enhanced Description:</strong> {result?.enhanced_description || 'N/A'}</p>
      <p><strong>Suggested Deadline:</strong> {result?.suggested_deadline || 'N/A'}</p>
      <p><strong>Priority Score:</strong> {result?.priority_score !== undefined ? result.priority_score : 'N/A'}</p>
      <p><strong>Suggested Category:</strong> {result?.suggested_category || 'N/A'}</p>

      {contextualSuggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Contextual Suggestions:</h4>
          <ul className="list-disc list-inside text-gray-600">
            {contextualSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {contextualSuggestions.length === 0 && (
         <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-gray-600 italic">No specific contextual suggestions generated based on the current input.</p>
         </div>
      )}
    </div>
  );
}