import { Request, Response } from "express";
import Performance from "../models/Performance";

export const getLevelAnalysis = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const rounds = await Performance.find({ sessionId }).sort({ createdAt: 1 });

    if (rounds.length === 0) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    const totalRounds = rounds.length;
    const correctRounds = rounds.filter(r => r.isCorrect).length;
    const accuracy = (correctRounds / totalRounds) * 100;
    const avgTime = rounds.reduce((sum, r) => sum + r.timeTaken, 0) / totalRounds;
    const maxStreak = Math.max(...rounds.map(r => r.streak || 0));

    let recommendation = "Keep practicing to improve your speed!";
    if (accuracy >= 85 && avgTime <= 4) recommendation = "Amazing! You've mastered this. Try a harder level!";
    else if (accuracy < 60) recommendation = "Let's try this level again to build your confidence.";

    res.json({
      totalRounds,
      correctRounds,
      wrongAnswers: totalRounds - correctRounds,
      accuracy: accuracy.toFixed(2),
      avgTime: avgTime.toFixed(2),
      maxStreak,
      recommendation,
      // Map rounds for the Bar Chart
      history: rounds.map((r, i) => ({
        round: `R${i + 1}`,
        time: r.timeTaken,
        isCorrect: r.isCorrect
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};