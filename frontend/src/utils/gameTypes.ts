export type GamePhase = "playing" | "transition" | "paused" | "finished";

export interface GameObject {
  id: number;
  name: string;
  image: string;
  difficulty: number;
}
