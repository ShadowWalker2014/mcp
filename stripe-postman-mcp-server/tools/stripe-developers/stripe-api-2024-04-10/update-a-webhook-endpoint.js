/**
 * Function to update a webhook endpoint in Stripe.
 *
 * @param {Object} args - Arguments for updating the webhook endpoint.
 * @param {string} args.webhook_endpoint - The ID of the webhook endpoint to update.
 * @param {boolean} [args.disabled] - Disable the webhook endpoint if set to true.
 * @param {Array<string>} [args.enabled_events] - The list of events to enable for this endpoint.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @param {string} [args.url] - The URL of the webhook endpoint.
 * @returns {Promise<Object>} - The result of the webhook endpoint update.
 */
const executeFunction = async ({ webhook_endpoint, disabled, enabled_events, expand, url }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  // Construct the body for the request
  const body = new URLSearchParams();
  if (disabled !== undefined) body.append('disabled', disabled);
  if (enabled_events) {
    enabled_events.forEach((event, index) => {
      body.append(`enabled_events[${index}]`, event);
    });
  }
  if (expand) {
    expand.forEach((field, index) => {
      body.append(`expand[${index}]`, field);
    });
  }
  if (url) body.append('url', url);

  try {
    // Perform the fetch request
    const response = await fetch(`${baseUrl}/v1/webhook_endpoints/${webhook_endpoint}`, {
      method: 'POST',
      headers,
      body: body.toString()
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating webhook endpoint:', error);
    return { error: 'An error occurred while updating the webhook endpoint.' };
  }
};

/**
 * Tool configuration for updating a webhook endpoint in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_webhook_endpoint',
      description: 'Update a webhook endpoint in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          webhook_endpoint: {
            type: 'string',
            description: 'The ID of the webhook endpoint to update.'
          },
          disabled: {
            type: 'boolean',
            description: 'Disable the webhook endpoint if set to true.'
          },
          enabled_events: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The list of events to enable for this endpoint.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Specifies which fields in the response should be expanded.'
          },
          url: {
            type: 'string',
            description: 'The URL of the webhook endpoint.'
          }
        },
        required: ['webhook_endpoint']
      }
    }
  }
};

export { apiTool };