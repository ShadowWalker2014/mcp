/**
 * Function to retrieve a coupon from Stripe.
 *
 * @param {Object} args - Arguments for the coupon retrieval.
 * @param {string} args.coupon - The ID of the coupon to retrieve.
 * @param {Array<string>} [args.expand] - Optional fields to expand in the response.
 * @returns {Promise<Object>} - The result of the coupon retrieval.
 */
const executeFunction = async ({ coupon, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with the coupon ID
    const url = new URL(`${baseUrl}/v1/coupons/${coupon}`);

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
    console.error('Error retrieving coupon:', error);
    return { error: 'An error occurred while retrieving the coupon.' };
  }
};

/**
 * Tool configuration for retrieving a coupon from Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_coupon',
      description: 'Retrieve a coupon from Stripe.',
      parameters: {
        type: 'object',
        properties: {
          coupon: {
            type: 'string',
            description: 'The ID of the coupon to retrieve.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Optional fields to expand in the response.'
          }
        },
        required: ['coupon']
      }
    }
  }
};

export { apiTool };