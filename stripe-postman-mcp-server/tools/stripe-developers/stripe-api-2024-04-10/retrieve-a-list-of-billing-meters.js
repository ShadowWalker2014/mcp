/**
 * Function to retrieve a list of billing meters from Stripe.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} [args.ending_before] - A cursor for use in pagination to fetch the previous page of the list.
 * @param {string} [args.starting_after] - A cursor for use in pagination to fetch the next page of the list.
 * @param {number} [args.limit=10] - A limit on the number of objects to be returned. Limit can range between 1 and 100.
 * @param {string} [args.status] - Filter results to only include meters with the given status.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The result of the billing meters retrieval.
 */
const executeFunction = async ({ ending_before, starting_after, limit = 10, status, expand }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/billing/meters`);
    if (ending_before) url.searchParams.append('ending_before', ending_before);
    if (starting_after) url.searchParams.append('starting_after', starting_after);
    if (limit) url.searchParams.append('limit', limit.toString());
    if (status) url.searchParams.append('status', status);
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
    console.error('Error retrieving billing meters:', error);
    return { error: 'An error occurred while retrieving billing meters.' };
  }
};

/**
 * Tool configuration for retrieving billing meters from Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'retrieve_billing_meters',
      description: 'Retrieve a list of billing meters from Stripe.',
      parameters: {
        type: 'object',
        properties: {
          ending_before: {
            type: 'string',
            description: 'A cursor for use in pagination to fetch the previous page of the list.'
          },
          starting_after: {
            type: 'string',
            description: 'A cursor for use in pagination to fetch the next page of the list.'
          },
          limit: {
            type: 'integer',
            description: 'A limit on the number of objects to be returned. Limit can range between 1 and 100.'
          },
          status: {
            type: 'string',
            description: 'Filter results to only include meters with the given status.'
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