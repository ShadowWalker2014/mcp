/**
 * Function to delete a webhook endpoint in Stripe.
 *
 * @param {Object} args - Arguments for the deletion.
 * @param {string} args.webhook_endpoint - The ID of the webhook endpoint to delete.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
const executeFunction = async ({ webhook_endpoint }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL for the deletion request
    const url = `${baseUrl}/v1/webhook_endpoints/${webhook_endpoint}`;

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
    console.error('Error deleting webhook endpoint:', error);
    return { error: 'An error occurred while deleting the webhook endpoint.' };
  }
};

/**
 * Tool configuration for deleting a webhook endpoint in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'delete_webhook_endpoint',
      description: 'Delete a webhook endpoint in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          webhook_endpoint: {
            type: 'string',
            description: 'The ID of the webhook endpoint to delete.'
          }
        },
        required: ['webhook_endpoint']
      }
    }
  }
};

export { apiTool };