//API ENDPOINTS

import expresss from "express";
import { getGameRound } from "../controllers/game-logic";
import { processTurn } from "../controllers/gameController";

const router=expresss.Router();

router.post('/process',processTurn);
router.get('/round',getGameRound);

export default router;