/**
 * Function to deactivate a billing meter in Stripe.
 *
 * @param {Object} args - Arguments for the deactivation.
 * @param {string} args.id - The unique identifier for the billing meter to deactivate.
 * @param {Array<string>} [args.expand] - Optional fields to expand in the response.
 * @returns {Promise<Object>} - The result of the deactivation request.
 */
const executeFunction = async ({ id, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseUrl}v1/billing/meters/${encodeURIComponent(id)}/deactivate`;

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // If a token is provided, add it to the Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Construct the body of the request
    const body = new URLSearchParams();
    expand.forEach((field, index) => {
      body.append(`expand[${index}]`, field);
    });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: body.toString(),
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
    console.error('Error deactivating billing meter:', error);
    return { error: 'An error occurred while deactivating the billing meter.' };
  }
};

/**
 * Tool configuration for deactivating a billing meter in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'deactivate_billing_meter',
      description: 'Deactivates a billing meter in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique identifier for the billing meter to deactivate.'
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
        required: ['id']
      }
    }
  }
};

export { apiTool };