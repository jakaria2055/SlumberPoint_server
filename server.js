import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/database.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebHook from "./controllers/clerkWebHooks.js";
import bodyParser from "body-parser"; // 👈 Add this

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // ✅ For normal API routes
// app.use(clerkMiddleware()); // ❌ Not needed unless you're securing routes

// ✅ RAW BODY FOR CLERK WEBHOOK
app.post("/api/clerk", bodyParser.raw({ type: "*/*" }), clerkWebHook);

app.get("/", (req, res) => res.send("API is Working fine"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
