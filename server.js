import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

const app = express();
const PORT = process.env.PORT || 3000;

const server = new McpServer({
  name: "agenten-team-mcp",
  version: "1.0.0",
});

server.tool(
  "hallo-welt",
  "Begrüßt den Nutzer",
  { name: z.string() },
  async ({ name }) => {
    return {
      content: [{ type: "text", text: `Hallo ${name}!` }],
    };
  }
);

let transport = null;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("Keine aktive SSE-Verbindung vorhanden.");
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`MCP-Server läuft auf Port ${PORT}`);
});
