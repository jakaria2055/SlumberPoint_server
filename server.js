import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/database.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebHook from "./controllers/clerkWebHooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

connectDB();
connectCloudinary();

const app = express();

app.use(cors());

// MIDDLEWARE
app.use(express.json());
app.use(clerkMiddleware())

//API TO LISTEN CLERK
app.use("/api/clerk", clerkWebHook);

app.get("/", (req, res) => res.send("API is Working fine"));
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running in port: ${PORT}`));
