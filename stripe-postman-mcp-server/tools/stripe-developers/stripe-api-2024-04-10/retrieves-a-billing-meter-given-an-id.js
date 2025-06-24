/**
 * Function to retrieve a billing meter by its ID from the Stripe API.
 *
 * @param {Object} args - Arguments for the retrieval.
 * @param {string} args.id - The unique identifier for the billing meter.
 * @param {Array<string>} [args.expand] - Optional fields to expand in the response.
 * @returns {Promise<Object>} - The result of the billing meter retrieval.
 */
const executeFunction = async ({ id, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;

  try {
    // Construct the URL with the billing meter ID
    const url = new URL(`${baseUrl}/v1/billing/meters/${id}`);

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
    console.error('Error retrieving billing meter:', error);
    return { error: 'An error occurred while retrieving the billing meter.' };
  }
};

/**
 * Tool configuration for retrieving a billing meter from Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_billing_meter',
      description: 'Retrieves a billing meter given an ID.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique identifier for the billing meter.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
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