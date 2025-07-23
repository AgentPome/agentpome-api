import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes'; // Make sure this path is correct

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON

// Route for auth APIs
app.use('/api/v1/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
