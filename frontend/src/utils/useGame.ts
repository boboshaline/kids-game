import { useCallback, useEffect, useRef, useState } from "react";
import { GameObject, GamePhase } from "./gameTypes";
import { calculateScore } from "./score";
import { generateRoundData } from "./useRoundGenerator";

const MAX_ROUNDS = 10;

export function useGameFlow(
  levelId: string,
  speak: (t: string) => void
) {
  const [round, setRound] = useState(1);
  const [target, setTarget] = useState<GameObject | null>(null);
  const [options, setOptions] = useState<GameObject[]>([]);
  const [phase, setPhase] = useState<GamePhase>("playing");

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const startTimeRef = useRef<number>(0);

  /* ----------------------------
     Generate round ONLY when round changes
  ----------------------------- */
  useEffect(() => {
    if (round > MAX_ROUNDS) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("finished");
      return;
    }

    const { target, options } = generateRoundData(levelId);

    setTarget(target);
    setOptions(options);
    setIsCorrect(null);
    startTimeRef.current = Date.now();
  }, [round, levelId]);

 
 
useEffect(() => {
  if (target && phase === "playing") {
    // Logic: Tell the user what to find
    speak(`Find the ${target.name}`);
  }
}, [target?.id, phase]);

  /* ----------------------------
     Handle correct match
  ----------------------------- */
  const onCorrectMatch = useCallback(() => {
    const timeTaken = Date.now() - startTimeRef.current;

    setIsCorrect(true);
    setStreak((s) => s + 1);
    setScore((s) => s + calculateScore(10, streak, timeTaken));
    setPhase("transition");

    setTimeout(() => {
      setRound((r) => r + 1);
      setPhase("playing");
    }, 500);
  }, [streak]);

  /* ----------------------------
     Handle wrong match
  ----------------------------- */
  const onWrongMatch = useCallback(() => {
    setIsCorrect(false);
    setStreak(0);
  }, []);

  /* ----------------------------
     Pause / Resume / Quit
  ----------------------------- */
  const pauseGame = () => setPhase("paused");

  const resumeGame = () => setPhase("playing");

  const quitGame = () => {
    setPhase("finished");
  };

  return {
    round,
    target,
    options,
    phase,
    score,
    streak,
    isCorrect,
    onCorrectMatch,
    onWrongMatch,
    pauseGame,
    resumeGame,
    quitGame,
  };
}
