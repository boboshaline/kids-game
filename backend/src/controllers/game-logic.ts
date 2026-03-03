import { exec } from "child_process";
import { Request, Response } from "express";

export const getGameRound = async (req:Request, res:Response) => {
  const level = req.query.levelId || "beginner";
  const numQuestions = 1; 

  exec(`python3 ./src/main.py ${level} ${numQuestions}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Python Error:", stderr);
      return res.status(500).json({ error: "Failed to generate quiz" });
    }

    try {
      const quizzes = JSON.parse(stdout);
      res.json({
        success: true,
        target: quizzes[0].target,
        options: quizzes[0].options,
        roundTotal: 10
      });
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr);
      res.status(500).json({ error: "Invalid quiz JSON" });
    }
  });
};
