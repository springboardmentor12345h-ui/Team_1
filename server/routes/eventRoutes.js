import express from "express";
import { getEvents, getEvent, createEvent, deleteEvent } from "../controllers/eventController.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createEvent
);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;