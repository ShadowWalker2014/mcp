/**
 * Function to retrieve a webhook endpoint from Stripe.
 *
 * @param {Object} args - Arguments for the retrieval.
 * @param {string} args.webhook_endpoint - The ID of the webhook endpoint to retrieve.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The result of the webhook endpoint retrieval.
 */
const executeFunction = async ({ webhook_endpoint, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with the webhook endpoint ID
    const url = new URL(`${baseUrl}/v1/webhook_endpoints/${webhook_endpoint}`);

    // Append expand parameters if provided
    expand.forEach((field, index) => {
      url.searchParams.append(`expand[${index}]`, field);
    });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // If a token is provided, add it to the Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
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
    console.error('Error retrieving webhook endpoint:', error);
    return { error: 'An error occurred while retrieving the webhook endpoint.' };
  }
};

/**
 * Tool configuration for retrieving a webhook endpoint from Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_webhook_endpoint',
      description: 'Retrieve a webhook endpoint from Stripe.',
      parameters: {
        type: 'object',
        properties: {
          webhook_endpoint: {
            type: 'string',
            description: 'The ID of the webhook endpoint to retrieve.',
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Specifies which fields in the response should be expanded.',
          },
        },
        required: ['webhook_endpoint'],
      },
    },
  },
};

export { apiTool };