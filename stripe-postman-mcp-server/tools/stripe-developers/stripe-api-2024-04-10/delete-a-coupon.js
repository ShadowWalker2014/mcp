/**
 * Function to delete a coupon in Stripe.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {string} args.coupon - The ID of the coupon to delete.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ coupon }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL for the coupon deletion
    const url = `${baseUrl}v1/coupons/${coupon}`;

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
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
    return await response.json();
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return { error: 'An error occurred while deleting the coupon.' };
  }
};

/**
 * Tool configuration for deleting a coupon in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_coupon',
      description: 'Delete a coupon in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          coupon: {
            type: 'string',
            description: 'The ID of the coupon to delete.'
          }
        },
        required: ['coupon']
      }
    }
  }
};

export { apiTool };