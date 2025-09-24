# Stripe MCP Server

A Model Context Protocol (MCP) server that provides comprehensive Stripe integration for AI assistants. Supports both local (stdio) and remote (HTTPS) deployment.

## Features

- **Products & Prices Management**: Create, list, retrieve, update, and archive Stripe products and prices
- **Webhooks Management**: Manage webhook endpoints for real-time event notifications
- **Customer Portal Configuration**: Configure the customer self-service portal
- **Advanced Querying**: Query Stripe resources with flexible filtering
- **Dual Transport Support**: Local stdio + Remote HTTPS with modern Streamable HTTP transport

## Quick Start

### Local Usage (Claude Desktop)

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": [
        "-y",
        "github:ShadowWalker2014/mcp",
        "mcp-stripe",
        "--api-key=sk_test_your_stripe_key_here"
      ]
    }
  }
}
```

### Remote Deployment

Choose your preferred platform:

#### Railway (Recommended)

1. Fork this repository
2. Connect to Railway
3. Set environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_your_live_key
   TRANSPORT_TYPE=http
   PORT=8080
   ```
4. Deploy automatically with included `Dockerfile` and `railway.json`

#### Vercel (Serverless)

1. Deploy to Vercel
2. Add environment variable: `STRIPE_SECRET_KEY`
3. Uses stateless transport - no persistent connections needed

#### Other Platforms

Works on any platform supporting Docker:
- Google Cloud Run
- AWS ECS/Fargate
- DigitalOcean App Platform
- Heroku

## Environment Variables

### Required
- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_`)

### Optional
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (starts with `pk_`)
- `STRIPE_WEBHOOK_SECRET`: Your webhook endpoint secret (starts with `whsec_`)
- `TRANSPORT_TYPE`: `stdio` (default) or `http`
- `PORT`: Port number for HTTP mode (default: 8080)

## Available Tools

### `stripe_connect`
Helper tool for Stripe setup guidance.
- **Parameters**: `purpose`, `features`

### `stripe_products`
Manage Stripe products.
- **Actions**: `create`, `list`, `retrieve`, `update`, `archive`
- **Parameters**: `action`, `product_id`, `name`, `description`, `images`, `metadata`, `active`

### `stripe_prices`
Manage pricing for products.
- **Actions**: `create`, `list`, `retrieve`, `update`, `archive`
- **Parameters**: `action`, `price_id`, `product_id`, `unit_amount`, `currency`, `recurring_interval`, `metadata`, `active`

### `stripe_webhooks`
Manage webhook endpoints.
- **Actions**: `create`, `list`, `retrieve`, `update`, `delete`
- **Parameters**: `action`, `webhook_id`, `url`, `enabled_events`, `description`, `enabled`

### `stripe_portal_config`
Configure customer portal settings.
- **Actions**: `create`, `list`, `retrieve`, `update`
- **Parameters**: Various configuration options for business profile and features

### `stripe_query`
Query Stripe data with advanced filtering.
- **Resources**: `events`, `charges`, `payment_intents`, `customers`, `subscriptions`, `invoices`, `products`, `prices`
- **Parameters**: `resource`, `filters`, `limit`, `expand`

## Client Connection

### Remote HTTPS (Modern)

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const client = new Client({
  name: "stripe-mcp-client",
  version: "1.0.0"
});

const transport = new StreamableHTTPClientTransport(
  new URL("https://your-app.railway.app")  // or vercel.app
);

await client.connect(transport);
```

### Local stdio

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "github:ShadowWalker2014/mcp", "mcp-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_key_here"
      }
    }
  }
}
```

## Development

### Local Development

```bash
# Clone repository
git clone https://github.com/ShadowWalker2014/mcp.git
cd mcp/stripe

# Install dependencies
npm install

# Build
npm run build

# Run locally (stdio mode)
STRIPE_SECRET_KEY=sk_test_your_key npm start

# Run locally (HTTP mode)
STRIPE_SECRET_KEY=sk_test_your_key npm run start:http
```

### Available Scripts

```bash
npm run dev          # Development mode (stdio)
npm run dev:http     # Development mode (HTTP)
npm run build        # Build TypeScript
npm run start        # Production (stdio)
npm run start:http   # Production (HTTP)
npm run watch        # Watch mode (stdio)
npm run watch:http   # Watch mode (HTTP)
```

## Health Check

Once deployed, test your server:

```bash
# Health check
curl https://your-app.railway.app/health

# Server info
curl https://your-app.railway.app/
```

## Security

- Never commit API keys to version control
- Use test keys during development (`sk_test_` and `pk_test_`)
- Use live keys only in production (`sk_live_` and `pk_live_`)
- Use webhook secrets to verify webhook authenticity
- Use restricted API keys when possible

## Example Usage

### Create a SaaS Pricing Model

1. **Create Products**: Use `stripe_products` with action "create"
2. **Add Pricing**: Use `stripe_prices` with action "create" for monthly/annual pricing
3. **Set Up Webhooks**: Use `stripe_webhooks` to listen for subscription events
4. **Configure Portal**: Use `stripe_portal_config` to allow customer self-service

### Analyze Payment Data

```
Query recent payments:
- resource: "payment_intents"
- filters: { status: "succeeded", created: { gte: 1640995200 } }

Query subscription events:
- resource: "events"
- filters: { type: "customer.subscription.created" }
```

## Support

- **Repository**: https://github.com/ShadowWalker2014/mcp
- **Issues**: https://github.com/ShadowWalker2014/mcp/issues
- **Stripe Documentation**: https://stripe.com/docs

## License

MIT License