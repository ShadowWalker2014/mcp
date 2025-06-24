/**
 * Function to create a webhook endpoint in Stripe.
 *
 * @param {Object} args - Arguments for creating the webhook endpoint.
 * @param {Array<string>} args.enabled_events - The list of events to enable for this endpoint.
 * @param {string} args.url - The URL of the webhook endpoint.
 * @param {string} [args.api_version] - The Stripe version to use for events sent to this endpoint.
 * @param {boolean} [args.connect=false] - Whether this endpoint should receive events from connected accounts.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The result of the webhook endpoint creation.
 */
const executeFunction = async ({ enabled_events, url, api_version, connect = false, expand }) => {
  const baseUrl = 'https://api.stripe.com/v1/webhook_endpoints';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;

  const formData = new URLSearchParams();
  enabled_events.forEach((event, index) => {
    formData.append(`enabled_events[${index}]`, event);
  });
  formData.append('url', url);
  if (api_version) formData.append('api_version', api_version);
  formData.append('connect', connect.toString());
  if (expand) {
    expand.forEach((field, index) => {
      formData.append(`expand[${index}]`, field);
    });
  }

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    // Perform the fetch request
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: formData
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
    console.error('Error creating webhook endpoint:', error);
    return { error: 'An error occurred while creating the webhook endpoint.' };
  }
};

/**
 * Tool configuration for creating a webhook endpoint in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_webhook_endpoint',
      description: 'Create a webhook endpoint in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          enabled_events: {
            type: 'array',
            items: {
              type: 'string',
              description: 'The list of events to enable for this endpoint.'
            },
            description: 'The list of events to enable for this endpoint.'
          },
          url: {
            type: 'string',
            description: 'The URL of the webhook endpoint.'
          },
          api_version: {
            type: 'string',
            description: 'The Stripe version to use for events sent to this endpoint.'
          },
          connect: {
            type: 'boolean',
            description: 'Whether this endpoint should receive events from connected accounts.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Specifies which fields in the response should be expanded.'
            },
            description: 'Specifies which fields in the response should be expanded.'
          }
        },
        required: ['enabled_events', 'url']
      }
    }
  }
};

export { apiTool };