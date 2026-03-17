import { Router } from "express";
import { gameEngine } from "../engine/game.engine";

const router = Router();

// =====================
// SPAWN KINGDOM
// =====================
router.post("/kingdom", (req, res, next) => {
  try {
    const { name, x, y } = req.body;

    const centerX: number = x !== undefined ? Number(x) : Math.floor(gameEngine.world.width / 2);
    const centerY: number = y !== undefined ? Number(y) : Math.floor(gameEngine.world.height / 2);

    const kingdom = gameEngine.spawnKingdom(name || `Kingdom-${Date.now()}`, centerX, centerY);

    if (!kingdom) {
      return res.status(400).json({ success: false, error: "Not enough faith or invalid position" });
    }

    res.json({
      success: true,
      kingdom
    });
  } catch (err) {
    next(err);
  }
});

// =====================
// TERRAFORM
// =====================
router.post("/terraform", (req, res, next) => {
  try {
    const { x, y, type } = req.body;

    if (x === undefined || y === undefined || !type) {
      return res.status(400).json({ success: false, error: "x, y and type are required" });
    }

    gameEngine.terraform(Number(x), Number(y), type);

    res.json({ success: true, message: "Tile updated" });
  } catch (err) {
    next(err);
  }
});

// =====================
// SPAWN VILLAGE
// =====================
router.post("/village", (req, res, next) => {
  try {
    const { x, y, name, kingdomId } = req.body;

    if (x === undefined || y === undefined || kingdomId === undefined) {
      return res.status(400).json({ success: false, error: "x, y, kingdomId are required" });
    }

    const village = gameEngine.spawnVillageInternal(
      Number(x),
      Number(y),
      name || "Village",
      Number(kingdomId)
    );

    if (!village) return res.status(400).json({ success: false, error: "Invalid tile or kingdom" });

    res.json({ success: true, village });
  } catch (err) {
    next(err);
  }
});

// =====================
// GET WORLD STATE
// =====================
router.get("/state", (req, res, next) => {
  try {
    const state = gameEngine.getWorldState();
    res.json({ success: true, state });
  } catch (err) {
    next(err);
  }
});

export default router;