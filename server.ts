import express from "express";
import { createServer as createViteServer } from "vite";
import { generateToolSummary, sendChatQuery, generateComparisonContent } from "./services/geminiService";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
  app.post("/api/ai/summary", async (req, res) => {
    try {
      const { toolName, description } = req.body;
      const result = await generateToolSummary(toolName, description);
      res.json(JSON.parse(result));
    } catch (error) {
      console.error("Summary API Error:", error);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { history } = req.body;
      const result = await sendChatQuery(history);
      res.json({ text: result });
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: "Failed to generate chat response" });
    }
  });

  app.post("/api/ai/compare", async (req, res) => {
    try {
      const { tool1, tool2, tool3 } = req.body;
      const result = await generateComparisonContent(tool1, tool2, tool3);
      res.json(result);
    } catch (error) {
      console.error("Comparison API Error:", error);
      res.status(500).json({ error: "Failed to generate comparison" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 AIZONET Server started on http://0.0.0.0:${PORT}`);
    console.log(`📡 API Routes: /api/ai/summary, /api/ai/chat, /api/ai/compare`);
  });
}

startServer();
