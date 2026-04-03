export type Theme = "light" | "dark";
export type Language = "en" | "zh";

export interface PantoneStyle {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
  border: string;
}

export interface Artifact {
  id: string;
  title: string;
  content: string;
  type: "input" | "summary" | "report" | "skill";
  timestamp: string;
  model?: string;
  version: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
  details?: string;
}

export interface AgentStep {
  id: string;
  name: string;
  status: "idle" | "running" | "success" | "error";
  prompt: string;
  model: string;
  output?: string;
}
