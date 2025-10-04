import express from "express";
import type { Express, Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import serverless from "serverless-http";
import { db } from "./db/client";

const app: Express = express();
const port = 3000;

app.use(express.json());
// app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Test database connection
app.get("/test-db", async (req: Request, res: Response) => {
  try {
    const result = await db.execute("SELECT NOW()"); // Simple query to test connection
    return res.json({ 
      status: "Database connected", 
      timestamp: result.rows[0] 
    });
  } catch (error) {
    return res.status(500).json({ 
      error: "Database connection failed", 
      message: (error as Error).message 
    });
  }
});

// Uncomment the following lines to deploy in our custom server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// Export the serverless handler
export default serverless(app);