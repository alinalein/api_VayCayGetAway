import express from "express";
import unsplashController from "../controllers/unsplashController";
const { saveSelectedUnsplashImage, getAllImagesByQuery } = unsplashController;
const router = express.Router();

router.post("/save-image", saveSelectedUnsplashImage);
router.get("/search", getAllImagesByQuery);

export default router;
