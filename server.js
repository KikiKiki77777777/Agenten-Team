import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mein-mcp-server",
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

const transport = new StdioServerTransport();
await server.connect(transport);
