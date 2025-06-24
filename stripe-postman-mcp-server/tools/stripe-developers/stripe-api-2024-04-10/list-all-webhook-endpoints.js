/**
 * Function to list all webhook endpoints in Stripe.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} [args.ending_before] - A cursor for pagination to fetch the previous page of the list.
 * @param {string} [args.starting_after] - A cursor for pagination to fetch the next page of the list.
 * @param {number} [args.limit] - A limit on the number of objects to be returned (1-100).
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The result of the webhook endpoints list.
 */
const executeFunction = async ({ ending_before, starting_after, limit, expand }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/webhook_endpoints`);
    if (ending_before) url.searchParams.append('ending_before', ending_before);
    if (starting_after) url.searchParams.append('starting_after', starting_after);
    if (limit) url.searchParams.append('limit', limit.toString());
    if (expand) expand.forEach(expandField => url.searchParams.append('expand[]', expandField));

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
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
    console.error('Error listing webhook endpoints:', error);
    return { error: 'An error occurred while listing webhook endpoints.' };
  }
};

/**
 * Tool configuration for listing webhook endpoints in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_webhook_endpoints',
      description: 'List all webhook endpoints in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          ending_before: {
            type: 'string',
            description: 'A cursor for pagination to fetch the previous page of the list.'
          },
          starting_after: {
            type: 'string',
            description: 'A cursor for pagination to fetch the next page of the list.'
          },
          limit: {
            type: 'integer',
            description: 'A limit on the number of objects to be returned (1-100).'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Specifies which fields in the response should be expanded.'
            },
            description: 'Specifies which fields in the response should be expanded.'
          }
        }
      }
    }
  }
};

export { apiTool };