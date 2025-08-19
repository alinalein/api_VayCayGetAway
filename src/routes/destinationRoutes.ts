import express from "express";
const router = express.Router();
import jwtAuth from "../middlewares/auth";
import { Request, Response } from "express";
import destinationController from "../controllers/destinationController";
const { getAllDestinations, getDestinationById, getUniqueTags } =
  destinationController;

router.get("/", async (req: Request, res: Response): Promise<void> => {
  res.json({ message: "API is working!" });
});

// add after to all again jwtAuth
router.get("/destinations", jwtAuth, getAllDestinations);

router.get("/destinations/:destinationId", jwtAuth, getDestinationById);

router.get("/tags", jwtAuth, getUniqueTags);

export default router;
