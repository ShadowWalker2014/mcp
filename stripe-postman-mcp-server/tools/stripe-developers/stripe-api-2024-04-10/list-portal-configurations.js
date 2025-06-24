/**
 * Function to list portal configurations in Stripe.
 *
 * @param {Object} args - Arguments for the request.
 * @param {boolean} [args.active] - Only return configurations that are active or inactive.
 * @param {string} [args.ending_before] - A cursor for pagination to fetch the previous page of the list.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @param {boolean} [args.is_default] - Only return the default or non-default configurations.
 * @param {number} [args.limit] - A limit on the number of objects to be returned (1-100).
 * @param {string} [args.starting_after] - A cursor for pagination to fetch the next page of the list.
 * @returns {Promise<Object>} - The result of the portal configurations list request.
 */
const executeFunction = async ({ active, ending_before, expand, is_default, limit, starting_after }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/billing_portal/configurations`);
    if (active !== undefined) url.searchParams.append('active', active);
    if (ending_before) url.searchParams.append('ending_before', ending_before);
    if (expand) expand.forEach(expandField => url.searchParams.append('expand[]', expandField));
    if (is_default !== undefined) url.searchParams.append('is_default', is_default);
    if (limit) url.searchParams.append('limit', limit);
    if (starting_after) url.searchParams.append('starting_after', starting_after);

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
    console.error('Error listing portal configurations:', error);
    return { error: 'An error occurred while listing portal configurations.' };
  }
};

/**
 * Tool configuration for listing portal configurations in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_portal_configurations',
      description: 'List portal configurations in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          active: {
            type: 'boolean',
            description: 'Only return configurations that are active or inactive.'
          },
          ending_before: {
            type: 'string',
            description: 'A cursor for pagination to fetch the previous page of the list.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Specifies which fields in the response should be expanded.'
            },
            description: 'Specifies which fields in the response should be expanded.'
          },
          is_default: {
            type: 'boolean',
            description: 'Only return the default or non-default configurations.'
          },
          limit: {
            type: 'integer',
            description: 'A limit on the number of objects to be returned (1-100).'
          },
          starting_after: {
            type: 'string',
            description: 'A cursor for pagination to fetch the next page of the list.'
          }
        }
      }
    }
  }
};

export { apiTool };