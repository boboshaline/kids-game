import { GAME_DATA } from "./game";
import { GameObject } from "./gameTypes";

export function generateRoundData(
  levelId: string
): { target: GameObject; options: GameObject[] } {
  const available = GAME_DATA.filter((item) =>
    levelId === "beginner" ? item.difficulty === 1 : item.difficulty <= 2
  );

  const shuffled = [...available].sort(() => 0.5 - Math.random());
  const options = shuffled.slice(0, levelId === "beginner" ? 3 : 4);
  const target = options[Math.floor(Math.random() * options.length)];

  return { target, options };
}
