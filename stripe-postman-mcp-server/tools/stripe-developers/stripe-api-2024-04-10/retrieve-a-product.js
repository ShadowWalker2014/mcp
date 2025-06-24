/**
 * Function to retrieve a product from Stripe.
 *
 * @param {Object} args - Arguments for the product retrieval.
 * @param {string} args.id - The unique product ID to retrieve.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The details of the retrieved product.
 */
const executeFunction = async ({ id, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with the product ID
    const url = new URL(`${baseUrl}/v1/products/${id}`);

    // Append expand parameters if provided
    expand.forEach((field, index) => {
      url.searchParams.append(`expand[${index}]`, field);
    });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    };

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
    console.error('Error retrieving product:', error);
    return { error: 'An error occurred while retrieving the product.' };
  }
};

/**
 * Tool configuration for retrieving a product from Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_product',
      description: 'Retrieve a product from Stripe.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique product ID to retrieve.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string'
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