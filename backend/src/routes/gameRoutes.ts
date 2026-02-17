//API ENDPOINTS

import expresss from "express";
import { getLevelAnalysis } from "../controllers/game-analysis";
import { getGameRound } from "../controllers/game-logic";
import { processTurn } from "../controllers/gameController";

const router=expresss.Router();

router.post('/process',processTurn);
router.get('/round',getGameRound);
router.get('/analysis/:sessionId',getLevelAnalysis);

export default router;