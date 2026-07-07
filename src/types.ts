export type ViewState =
  | "home"
  | "games"
  | "generator"
  | "dashboard"
  | "admin-dashboard"
  | "user-dashboard"
  | "leaderboard"
  | "shark-ladder"
  | "media-studio"
  | "mystery-box";

export interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  players: string;
  time: string;
  subject: string;
  grade: string;
  imageUrl: string;
  isPopular?: boolean;
  isNew?: boolean;
  isAI?: boolean;
  color: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}
