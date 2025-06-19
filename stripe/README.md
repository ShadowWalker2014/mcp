# Stripe MCP Server

A Model Context Protocol (MCP) server that provides comprehensive Stripe integration capabilities. This server allows AI assistants to interact with Stripe's API to manage products, prices, webhooks, customer portal configurations, and query various Stripe resources.

## Features

- **Products Management**: Create, list, retrieve, update, and archive Stripe products
- **Prices Management**: Create, list, retrieve, update, and archive Stripe prices with support for one-time and recurring billing
- **Webhooks Management**: Create, list, retrieve, update, and delete webhook endpoints
- **Customer Portal Configuration**: Manage Stripe customer portal settings and features
- **Advanced Querying**: Query various Stripe resources (events, charges, payment intents, customers, subscriptions, invoices, products, prices) with flexible filtering
- **Connection Helper**: Assist with Stripe setup and configuration

## Available Tools

### 1. `stripe_connect`
Helper tool to guide Stripe connection setup.
- **Parameters**: `purpose`, `features`
- **Purpose**: Explains what environment variables are needed for Stripe integration

### 2. `stripe_products`
Manage Stripe products (your service offerings).
- **Actions**: `create`, `list`, `retrieve`, `update`, `archive`
- **Parameters**: `action`, `product_id`, `name`, `description`, `images`, `metadata`, `active`

### 3. `stripe_prices`
Manage pricing for your products.
- **Actions**: `create`, `list`, `retrieve`, `update`, `archive`
- **Parameters**: `action`, `price_id`, `product_id`, `unit_amount`, `currency`, `recurring_interval`, `recurring_interval_count`, `metadata`, `active`

### 4. `stripe_webhooks`
Manage webhook endpoints for real-time event notifications.
- **Actions**: `create`, `list`, `retrieve`, `update`, `delete`
- **Parameters**: `action`, `webhook_id`, `url`, `enabled_events`, `description`, `enabled`

### 5. `stripe_portal_config`
Configure the customer self-service portal.
- **Actions**: `create`, `list`, `retrieve`, `update`
- **Parameters**: Various configuration options for business profile, features, and customer update permissions

### 6. `stripe_query`
Query and analyze Stripe data with advanced filtering.
- **Resources**: `events`, `charges`, `payment_intents`, `customers`, `subscriptions`, `invoices`, `products`, `prices`
- **Parameters**: `resource`, `filters`, `limit`, `expand`

## Installation

1. Clone or download this MCP server
2. Install dependencies:
   ```bash
   cd mcp/stripe
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Configuration

### Environment Variables

Set the following environment variables:

- **Required**:
  - `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_`)

- **Optional**:
  - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (starts with `pk_`)
  - `STRIPE_WEBHOOK_SECRET`: Your webhook endpoint secret (starts with `whsec_`)

### Example Environment Setup

Create a `.env` file in the server directory:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here  
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Usage

### Running the Server

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

#### Watch Mode (for development)
```bash
npm run watch
```

### Using with MCP Clients

The server communicates over stdio, making it compatible with various MCP clients. Here are example configurations:

#### Claude Desktop Configuration
Add to your Claude Desktop config file:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "node",
      "args": ["/path/to/mcp/stripe/dist/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_key_here"
      }
    }
  }
}
```

#### Direct Node.js Usage
```bash
STRIPE_SECRET_KEY=sk_test_your_key_here node dist/index.js
```

## Example Usage Scenarios

### Setting Up a SaaS Pricing Model

1. **Create Products**:
   ```
   Use stripe_products with action "create" to create:
   - Basic Plan
   - Pro Plan  
   - Enterprise Plan
   ```

2. **Create Pricing**:
   ```
   Use stripe_prices with action "create" to add:
   - Monthly and annual pricing for each plan
   - Different currency options
   ```

3. **Set Up Webhooks**:
   ```
   Use stripe_webhooks with action "create" to listen for:
   - payment_intent.succeeded
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   ```

4. **Configure Customer Portal**:
   ```
   Use stripe_portal_config with action "create" to allow customers to:
   - Update payment methods
   - Cancel subscriptions
   - View invoice history
   ```

### Analyzing Payment Data

Use `stripe_query` to analyze your Stripe data:

```
Query recent successful payments:
- resource: "payment_intents"
- filters: { status: "succeeded", created: { gte: 1640995200 } }

Query subscription events:
- resource: "events" 
- filters: { type: "customer.subscription.created" }

Query high-value customers:
- resource: "customers"
- expand: ["subscriptions"]
```

## Security Considerations

- **API Keys**: Never commit API keys to version control. Use environment variables.
- **Webhook Secrets**: Use webhook secrets to verify webhook authenticity.
- **Test vs Live**: Use test keys during development (`sk_test_` and `pk_test_`).
- **Permissions**: Use restricted API keys when possible, limiting access to only needed resources.

## Error Handling

The server includes comprehensive error handling:
- Invalid parameters return descriptive error messages
- Stripe API errors are caught and formatted consistently
- All errors are logged to stderr for debugging

## Development

### Project Structure
```
mcp/stripe/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (after build)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Adding New Tools

To add new Stripe functionality:

1. Add a new `server.tool()` call in `src/index.ts`
2. Define the tool parameters using Zod schemas
3. Implement the tool logic with proper error handling
4. Update this README with the new tool documentation

## Troubleshooting

### Common Issues

1. **"STRIPE_SECRET_KEY environment variable is required"**
   - Ensure you've set the `STRIPE_SECRET_KEY` environment variable
   - Check that the key starts with `sk_`

2. **"Invalid API Key"**
   - Verify your API key is correct and active
   - Ensure you're using the right key for your environment (test vs live)

3. **Webhook creation fails**
   - Ensure the webhook URL starts with `https://`
   - Check that the URL is publicly accessible

4. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that you're using Node.js 18 or higher

### Debugging

Enable debug logging by setting the environment variable:
```bash
DEBUG=stripe-mcp-server npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 