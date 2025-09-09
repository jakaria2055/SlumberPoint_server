import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/database.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebHook from "./controllers/clerkWebHooks.js";

connectDB();

const app = express();

app.use(cors());

// MIDDLEWARE
app.use(express.json());
app.use(clerkMiddleware())

//API TO LISTN CLERK
app.use("/api/clerk", clerkWebHook);

app.get("/", (req, res) => res.send("API is Working fine"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running in port: ${PORT}`));
