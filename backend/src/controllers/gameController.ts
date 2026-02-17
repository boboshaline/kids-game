import { Request, Response } from 'express';
import Performance from '../models/Performance';

export const processTurn = async (req: Request, res: Response) => {
  try {
    const { levelId, choiceId, targetId, timeTaken, round, streak,sessionId } = req.body;
    console.log("session id",sessionId);
if (!sessionId) {
  return res.status(400).json({ success: false, message: "Session ID required" });
}
    // Security Check: Prevent saving if rounds exceed the limit
    if (round > 10) {
      return res.status(400).json({ success: false, message: "Game already completed" });
    }

    const isCorrect = choiceId === targetId;
    const newStreak = isCorrect ? (streak || 0) + 1 : 0;

    // AI logic (as we did before)
    let aiDecision = isCorrect ? "proceed" : "review_needed";
    let message = isCorrect ? "Correct!" : "Try again!";

    // Save to MongoDB
    const record = await Performance.create({
      sessionId,
      levelId,
      round,
      isCorrect,
      timeTaken,
      streak: newStreak,
      aiDecision,
      timestamp: new Date()
    });

    res.json({
      success: true,
      isCorrect,
      newStreak,
      message,
      aiDecision,
      isLastRound: round === 10 // Tell frontend this was the final turn
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};