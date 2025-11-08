import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from './lib/supabase';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AquaAware backend is running 🌊");
});

// Supabase health check route (server-side check using service role key)
app.get('/supabase-health', async (req: Request, res: Response): Promise<void> => {
  try {
    // Try a minimal admin operation: list a single user (requires service role key)
    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1 });
    if (error) {
      res.status(502).json({ ok: false, error: error.message });
      return;
    }

    const userCountSample = Array.isArray((data as any)?.users) ? (data as any).users.length : 0;
    res.json({ ok: true, userCountSample });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});