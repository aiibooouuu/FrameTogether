import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import initializeSocket from "./socket/socket.js";

import roomRoutes from "./routes/roomRoutes.js";

dotenv.config();

/* ==========================================================
   FrameTogether Backend
========================================================== */

const app = express();
const server = http.createServer(app);
initializeSocket(server);

/* ==========================================================
   Middleware
========================================================== */

const allowedOrigins = [
  "https://frame-together.vercel.app",
  "http://localhost:5173",
  "https://frame-together-2oqb.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

/* ==========================================================
   Routes
========================================================== */

app.get("/", (req, res) => {
      res.json({
         success: true,
         name: "FrameTogether API",
         version: "1.0.0",
         status: "Running"
      });
});

app.use("/api/rooms", roomRoutes);

/* ==========================================================
   Socket.IO
========================================================== */



/* ==========================================================
   Server
========================================================== */

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
});