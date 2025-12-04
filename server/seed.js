import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import Event from "./models/event.js";
import { mockEvents } from "../client/src/assets/mock.js";

const seed = async () => {
  await connectDB();
  await Event.deleteMany();
  await Event.insertMany(mockEvents);
  console.log("Mock events pushed to DB");
  process.exit();
};

seed();