#!/usr/bin/env node
// Vercel-optimized stateless MCP server
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import Stripe from "stripe";
// Get Stripe configuration from environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY environment variable is required");
}
// Initialize Stripe client
const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2025-05-28.basil',
    typescript: true
});
// Helper function to handle errors consistently
function handleError(error) {
    console.error('Stripe MCP Server Error:', error);
    return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
    };
}
// Create a new server instance for each request (stateless)
function createServer() {
    const server = new McpServer({
        name: "stripe-mcp-server",
        version: "1.0.0"
    });
    // Add all the Stripe tools (same as main server)
    // Stripe Connect Tool
    server.tool("stripe_connect", {
        purpose: z.string().describe("Explanation of why Stripe connection is needed"),
        features: z.array(z.string()).describe("List of Stripe features that will be used")
    }, async ({ purpose, features }) => {
        return {
            content: [{
                    type: "text",
                    text: `Stripe connection requested for: ${purpose}\nFeatures needed: ${features.join(', ')}\n\nEnvironment variables configured: ✅ STRIPE_SECRET_KEY`
                }]
        };
    });
    // Stripe Products Tool (simplified for demo)
    server.tool("stripe_products", {
        action: z.enum(['create', 'list']).describe("The action to perform on products"),
        name: z.string().optional().describe("Product name (required for create)")
    }, async ({ action, name }) => {
        try {
            switch (action) {
                case 'create':
                    if (!name) {
                        return {
                            content: [{
                                    type: "text",
                                    text: JSON.stringify({ success: false, error: 'Product name is required for create action' }, null, 2)
                                }]
                        };
                    }
                    const product = await stripe.products.create({ name });
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    success: true,
                                    product,
                                    message: `Successfully created product: ${product.name}`
                                }, null, 2)
                            }]
                    };
                case 'list':
                    const products = await stripe.products.list({ limit: 10 });
                    return {
                        content: [{
                                type: "text",
                                text: JSON.stringify({
                                    success: true,
                                    products: products.data,
                                    message: `Found ${products.data.length} product(s)`
                                }, null, 2)
                            }]
                    };
            }
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(handleError(error), null, 2)
                    }]
            };
        }
    });
    return server;
}
// Vercel serverless function handler
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method === 'GET') {
        // Health check / info endpoint
        res.status(200).json({
            name: 'Stripe MCP Server',
            version: '1.0.0',
            description: 'Model Context Protocol server for Stripe integration',
            transport: 'stateless-http',
            platform: 'vercel-serverless',
            endpoints: {
                mcp: '/api/mcp (POST) - Stateless Streamable HTTP'
            },
            tools: ['stripe_connect', 'stripe_products']
        });
        return;
    }
    if (req.method === 'POST') {
        try {
            // Create new server and transport for each request (stateless)
            const server = createServer();
            const transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: undefined, // 🔑 Stateless mode
            });
            // Clean up on request end
            res.on('close', () => {
                transport.close();
                server.close();
            });
            // Connect server to transport
            await server.connect(transport);
            // Handle the MCP request
            await transport.handleRequest(req, res, req.body);
        }
        catch (error) {
            console.error('Error handling MCP request:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    jsonrpc: '2.0',
                    error: {
                        code: -32603,
                        message: 'Internal server error',
                    },
                    id: null,
                });
            }
        }
    }
    else {
        res.status(405).json({
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Method not allowed."
            },
            id: null
        });
    }
}
//# sourceMappingURL=vercel.js.map