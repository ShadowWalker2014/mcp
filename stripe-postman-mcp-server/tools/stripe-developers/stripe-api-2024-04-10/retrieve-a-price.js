/**
 * Function to retrieve a price from the Stripe API.
 *
 * @param {Object} args - Arguments for the price retrieval.
 * @param {string} args.price - The ID of the price to retrieve.
 * @param {Array<string>} [args.expand] - Optional fields to expand in the response.
 * @returns {Promise<Object>} - The result of the price retrieval.
 */
const executeFunction = async ({ price, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with path variable
    const url = new URL(`${baseUrl}/v1/prices/${price}`);

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
    console.error('Error retrieving price:', error);
    return { error: 'An error occurred while retrieving the price.' };
  }
};

/**
 * Tool configuration for retrieving a price from the Stripe API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_price',
      description: 'Retrieve a price from the Stripe API.',
      parameters: {
        type: 'object',
        properties: {
          price: {
            type: 'string',
            description: 'The ID of the price to retrieve.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Specifies which fields in the response should be expanded.'
            },
            description: 'Optional fields to expand in the response.'
          }
        },
        required: ['price']
      }
    }
  }
};

export { apiTool };