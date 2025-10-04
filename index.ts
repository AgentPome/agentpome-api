import express from "express";
import type { Express, Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import serverless from "serverless-http";

const app: Express = express();
const port = 3000;

app.use(express.json());
app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Uncomment the following lines to deploy in our custom server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// Export the serverless handler
export const handler = serverless(app);