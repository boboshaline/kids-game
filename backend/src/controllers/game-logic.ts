import { Request, Response } from "express";

// No longer need exec or PYTHON_PATH here!
// The Python server will be running on port 5001.
const PYTHON_API_URL = "http://localhost:5001/generate-quiz";

export const getGameRound = async (req: Request, res: Response) => {
  const level = req.query.levelId || "beginner";
  const numQuestions = 1;
console.log(`Generating quiz for level: ${level}, num_questions: ${numQuestions}`);
  try {
    // 1. Call the Python API instead of spawning a process
    const response = await fetch(PYTHON_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: level,
        num_questions: numQuestions
      })
    });
    if (!response.ok) {
      throw new Error(`AI Service responded with status: ${response.status}`);
    }

    const quizzes: any = await response.json();
    console.log("Received quiz data from AI service:", quizzes);

    // 2. Return the data to the UI
    res.json({
      success: true,
      target: quizzes[0].target,
      options: quizzes[0].options,
      roundTotal: 10
    });

  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to connect to the AI service. Is server.py running?" 
    });
  }
};