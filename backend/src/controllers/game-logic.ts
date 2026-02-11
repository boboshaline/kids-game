import { Request, Response } from 'express';

import { GAME_DATA } from '../data/game';

export const getGameRound = (req: Request, res: Response) => {
    // levelId comes from req.query (matching your RTK Query call)
    const { levelId } = req.query; 

    const available = GAME_DATA.filter((item) => {
        if (levelId === "beginner") return item.difficulty === 1;
        if (levelId === "medium") return item.difficulty === 2;
        if (levelId === "advanced") return item.difficulty === 3;
        return false;
    });

    // Shuffle and pick options
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const optionCount = levelId === "beginner" ? 2 : levelId === "medium" ? 3 : 4;
    const options = shuffled.slice(0, optionCount);
    const target = options[Math.floor(Math.random() * options.length)];

    res.json({
        success: true,
        target,
        options,
        roundTotal: 10 // Backend confirms the limit
    });
};