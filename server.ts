import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for school verification
  app.post("/api/verify-school", async (req, res) => {
    const { email, school_name, subdomain } = req.body;
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.VITE_SUPABASE_URL) {
      return res.status(500).json({ error: "Server configuration missing" });
    }

    const adminSupabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 1. Create User
    const { data: userData, error: userError } = await adminSupabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { school_name, subdomain }
    });

    if (userError) return res.status(400).json({ error: userError.message });

    // 2. We can optionally assign roles or profile data here if needed,
    // but the user only asked for Auth account creation.

    res.json({ success: true, user: userData.user });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
