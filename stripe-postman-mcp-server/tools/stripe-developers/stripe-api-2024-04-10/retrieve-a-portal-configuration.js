/**
 * Function to retrieve a portal configuration from Stripe.
 *
 * @param {Object} args - Arguments for the retrieval.
 * @param {string} args.configuration - The ID of the portal configuration to retrieve.
 * @param {Array<string>} [args.expand] - Optional fields to expand in the response.
 * @returns {Promise<Object>} - The result of the portal configuration retrieval.
 */
const executeFunction = async ({ configuration, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with the configuration ID
    const url = new URL(`${baseUrl}/v1/billing_portal/configurations/${configuration}`);

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
      headers
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
    console.error('Error retrieving portal configuration:', error);
    return { error: 'An error occurred while retrieving the portal configuration.' };
  }
};

/**
 * Tool configuration for retrieving a portal configuration from Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_portal_configuration',
      description: 'Retrieve a portal configuration from Stripe.',
      parameters: {
        type: 'object',
        properties: {
          configuration: {
            type: 'string',
            description: 'The ID of the portal configuration to retrieve.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Optional fields to expand in the response.'
            },
            description: 'Specifies which fields in the response should be expanded.'
          }
        },
        required: ['configuration']
      }
    }
  }
};

export { apiTool };