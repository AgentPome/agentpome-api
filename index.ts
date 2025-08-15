import express from "express";
import type { Express, Request, Response } from "express";
import authRoutes from "./routes/auth.routes";

const app: Express = express();
const port = 3000;

// Question: Think about CORS policy here.
app.use(express.json());
app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});