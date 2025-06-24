/**
 * Function to delete a product from Stripe.
 *
 * @param {Object} args - Arguments for the delete operation.
 * @param {string} args.id - The ID of the product to delete.
 * @returns {Promise<Object>} - The result of the delete operation.
 */
const executeFunction = async ({ id }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL for the product deletion
    const url = `${baseUrl}v1/products/${id}`;

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'DELETE',
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
    console.error('Error deleting product:', error);
    return { error: 'An error occurred while deleting the product.' };
  }
};

/**
 * Tool configuration for deleting a product from Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_product',
      description: 'Delete a product from Stripe.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the product to delete.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };