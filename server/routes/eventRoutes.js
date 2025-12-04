import express from "express";
import { getEvents, getEvent, createEvent, deleteEvent } from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", createEvent);
router.delete("/:id", deleteEvent);

export default router;