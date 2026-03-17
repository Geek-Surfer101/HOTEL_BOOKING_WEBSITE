import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/ClerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Create Express app
const app = express();

// Basic middleware
app.use(cors());

// Webhook must receive raw body for signature verification and must bypass auth
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// JSON parsing for the rest of the routes
app.use(express.json());

// Conditionally apply Clerk middleware (skip if not configured)
const hasClerk = !!(process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
const maybeClerk = hasClerk ? clerkMiddleware() : (req, _res, next) => next();
app.use(maybeClerk);

// Initialize connections on first request
app.use(async (req, res, next) => {
  try {
    await initializeConnections();
    next();
  } catch (error) {
    console.error("Connection initialization failed:", error);
    res.status(500).json({ error: "Server initialization failed" });
  }
});

// Simple health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check for serverless function
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Avoid favicon 500 noise in logs
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Initialize connections lazily (not at module load time)
let isInitialized = false;

const initializeConnections = async () => {
  if (isInitialized) return;

  try {
    await connectDB();
    console.log("MongoDB connected successfully");
    await connectCloudinary();
    console.log("Cloudinary configured successfully");
    isInitialized = true;
  } catch (err) {
    console.error("Initialization failed:", err);
    throw err;
  }
};

// API routes (webhook already mounted above with raw body)
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// For local development server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;

  // Initialize connections for local development
  initializeConnections()
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error("Failed to start server:", err);
      process.exit(1);
    });
}

// Export for Vercel serverless
export default app;
