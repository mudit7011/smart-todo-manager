const API_BASE_URL = "http://localhost:8000/api";

export async function getAISuggestions(taskData) {
  console.log("Data being sent to AI for suggestions:", taskData);
  const res = await fetch("http://127.0.0.1:8000/api/ai/suggestions/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Groq API error:", errorText);
    throw new Error("AI suggestion failed");
  }

  return await res.json();
}

export async function postContextEntry(data) {
  const res = await fetch("http://127.0.0.1:8000/api/contexts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to submit context entry:", errorText);
    throw new Error("Context submission failed");
  }

  return await res.json();
}

export async function getAllTasks() {
  const res = await fetch("http://127.0.0.1:8000/api/tasks/");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json();
}

export async function createTask(task) {
  const res = await fetch("http://127.0.0.1:8000/api/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return await res.json();
}

export async function getCategories() {
  const res = await fetch("http://127.0.0.1:8000/api/categories/");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return await res.json();
}

export async function updateTaskStatus(taskId, payload) {
  const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return await res.json();
}

export async function deleteTask(taskId) {
  const res = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
}

export const getTaskById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch task with ID ${id}`);
  }
  return response.json();
};

export async function deleteContextEntry(id) {
  const res = await fetch(`${API_BASE_URL}/contexts/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to delete context entry:", errorText);
    throw new Error("Context deletion failed");
  }

}