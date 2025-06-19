# Installation Guide: Stripe MCP Server

This guide shows you how to install and configure the Stripe MCP Server in various environments.

## Prerequisites

- Node.js 18 or higher
- A Stripe account with API keys
- Claude Desktop, Cursor, or another MCP-compatible client

## Installation Methods

### Method 1: NPX Installation (Recommended)

This is the easiest method for most users:

```bash
npx -y github:ShadowWalker2014/mcp stripe/dist/index.js
```

### Method 2: Clone and Build Locally

For development or customization:

```bash
# Clone the repository
git clone https://github.com/ShadowWalker2014/mcp.git
cd mcp/stripe

# Install dependencies
npm install

# Build the project
npm run build

# Test the server
STRIPE_SECRET_KEY=sk_test_your_key_here npm start
```

## Configuration

### Environment Variables

Set these environment variables:

- **Required**: `STRIPE_SECRET_KEY` - Your Stripe secret key
- **Optional**: `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- **Optional**: `STRIPE_WEBHOOK_SECRET` - Your webhook secret

### Claude Desktop Configuration

Add this to your Claude Desktop configuration file:

**Location of config file:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration:**

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "github:ShadowWalker2014/mcp", "stripe/dist/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_stripe_key_here"
      }
    }
  }
}
```

### Cursor Configuration

For Cursor IDE, add this to your MCP configuration:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "github:ShadowWalker2014/mcp", "stripe/dist/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_stripe_key_here"
      }
    }
  }
}
```

## Testing the Installation

1. **Start your MCP client** (Claude Desktop or Cursor)
2. **Check for the Stripe tools** - You should see tools like:
   - `stripe_connect`
   - `stripe_products`
   - `stripe_prices`
   - `stripe_webhooks`
   - `stripe_portal_config`
   - `stripe_query`

3. **Test a simple command**:
   ```
   Use the stripe_products tool to list my products
   ```

## Troubleshooting

### Common Issues

1. **"STRIPE_SECRET_KEY environment variable is required"**
   - Make sure you've set the environment variable in your MCP client config
   - Verify the key starts with `sk_test_` or `sk_live_`

2. **"Command not found: npx"**
   - Install Node.js 18 or higher
   - Make sure npm is in your PATH

3. **"Invalid API Key"**
   - Check that your Stripe API key is correct
   - Ensure you're using the right environment (test vs live)

4. **Tools not appearing**
   - Restart your MCP client
   - Check the client logs for errors
   - Verify the configuration syntax is correct

### Debug Mode

To run the server with debug information:

```bash
DEBUG=stripe-mcp-server STRIPE_SECRET_KEY=sk_test_your_key_here npx github:ShadowWalker2014/mcp stripe/dist/index.js
```

## Security Notes

- **Never commit API keys** to version control
- **Use test keys** during development
- **Restrict API key permissions** in your Stripe dashboard
- **Use webhook secrets** to verify webhook authenticity

## Getting Help

- Check the [README](./README.md) for detailed tool documentation
- Report issues on [GitHub Issues](https://github.com/ShadowWalker2014/mcp/issues)
- Review Stripe's [API documentation](https://stripe.com/docs/api)

## Version Updates

To update to the latest version:

```bash
# NPX will automatically fetch the latest version
npx -y github:ShadowWalker2014/mcp stripe/dist/index.js
```

For local installations:
```bash
git pull origin main
npm install
npm run build
``` 