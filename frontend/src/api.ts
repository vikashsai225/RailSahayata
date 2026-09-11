const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export type Task = {
  id: string;
  department: string;
  asset: string;
  location: string;
  defect: string;
  criticality: string;
  score: number | null;
  priorityScore?: number;
  due: string;
  duration: string;
  status: string;
};

export type NewTask = {
  id?: string;
  department: string;
  asset: string;
  location: string;
  defect: string;
  criticality: string;
  due?: string;
  duration?: string;
};

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`);

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status}`);
  }

  return response.json();
}

export async function createTask(task: NewTask): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create task");
  }

  return data.task;
}