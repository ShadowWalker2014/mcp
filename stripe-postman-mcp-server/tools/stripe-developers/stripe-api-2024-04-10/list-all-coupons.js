/**
 * Function to list all coupons from Stripe.
 *
 * @param {Object} args - Arguments for the coupon list.
 * @param {number} [args.created_gt] - A filter for coupons created after a specific timestamp.
 * @param {number} [args.created_gte] - A filter for coupons created on or after a specific timestamp.
 * @param {number} [args.created_lt] - A filter for coupons created before a specific timestamp.
 * @param {number} [args.created_lte] - A filter for coupons created on or before a specific timestamp.
 * @param {string} [args.ending_before] - A cursor for pagination to fetch previous pages.
 * @param {string} [args.expand] - Specifies which fields in the response should be expanded.
 * @param {number} [args.limit] - A limit on the number of objects to be returned (1-100).
 * @param {string} [args.starting_after] - A cursor for pagination to fetch next pages.
 * @returns {Promise<Object>} - The result of the coupon list request.
 */
const executeFunction = async ({
  created_gt,
  created_gte,
  created_lt,
  created_lte,
  ending_before,
  expand,
  limit,
  starting_after
}) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/coupons`);
    if (created_gt) url.searchParams.append('created[gt]', created_gt);
    if (created_gte) url.searchParams.append('created[gte]', created_gte);
    if (created_lt) url.searchParams.append('created[lt]', created_lt);
    if (created_lte) url.searchParams.append('created[lte]', created_lte);
    if (ending_before) url.searchParams.append('ending_before', ending_before);
    if (expand) url.searchParams.append('expand[]', expand);
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
    console.error('Error listing coupons:', error);
    return { error: 'An error occurred while listing coupons.' };
  }
};

/**
 * Tool configuration for listing coupons from Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_coupons',
      description: 'List all coupons from Stripe.',
      parameters: {
        type: 'object',
        properties: {
          created_gt: {
            type: 'integer',
            description: 'A filter for coupons created after a specific timestamp.'
          },
          created_gte: {
            type: 'integer',
            description: 'A filter for coupons created on or after a specific timestamp.'
          },
          created_lt: {
            type: 'integer',
            description: 'A filter for coupons created before a specific timestamp.'
          },
          created_lte: {
            type: 'integer',
            description: 'A filter for coupons created on or before a specific timestamp.'
          },
          ending_before: {
            type: 'string',
            description: 'A cursor for pagination to fetch previous pages.'
          },
          expand: {
            type: 'string',
            description: 'Specifies which fields in the response should be expanded.'
          },
          limit: {
            type: 'integer',
            description: 'A limit on the number of objects to be returned (1-100).'
          },
          starting_after: {
            type: 'string',
            description: 'A cursor for pagination to fetch next pages.'
          }
        }
      }
    }
  }
};

export { apiTool };