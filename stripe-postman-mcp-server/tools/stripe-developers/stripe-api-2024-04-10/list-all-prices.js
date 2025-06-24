/**
 * Function to list all prices from the Stripe API.
 *
 * @param {Object} args - Arguments for the price list.
 * @param {boolean} [args.active] - Only return prices that are active or inactive.
 * @param {number} [args.created_gt] - Filter based on the object `created` field, greater than.
 * @param {number} [args.created_gte] - Filter based on the object `created` field, greater than or equal to.
 * @param {number} [args.created_lt] - Filter based on the object `created` field, less than.
 * @param {number} [args.created_lte] - Filter based on the object `created` field, less than or equal to.
 * @param {string} [args.currency] - Only return prices for the given currency.
 * @param {string} [args.ending_before] - Cursor for pagination, ending before this object ID.
 * @param {string} [args.expand] - Specifies which fields in the response should be expanded.
 * @param {number} [args.limit] - A limit on the number of objects to be returned.
 * @param {string} [args.lookup_keys] - Only return the price with these lookup_keys.
 * @param {string} [args.product] - Only return prices for the given product.
 * @param {string} [args.recurring] - Only return prices with these recurring fields.
 * @param {string} [args.starting_after] - Cursor for pagination, starting after this object ID.
 * @param {string} [args.type] - Only return prices of type `recurring` or `one_time`.
 * @returns {Promise<Object>} - The result of the price list request.
 */
const executeFunction = async (args = {}) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/prices`);
    Object.keys(args).forEach(key => {
      if (args[key] !== undefined) {
        url.searchParams.append(key, args[key]);
      }
    });

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
    console.error('Error listing prices:', error);
    return { error: 'An error occurred while listing prices.' };
  }
};

/**
 * Tool configuration for listing prices from the Stripe API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_all_prices',
      description: 'List all prices from the Stripe API.',
      parameters: {
        type: 'object',
        properties: {
          active: {
            type: 'boolean',
            description: 'Only return prices that are active or inactive.'
          },
          created_gt: {
            type: 'integer',
            description: 'Filter based on the object `created` field, greater than.'
          },
          created_gte: {
            type: 'integer',
            description: 'Filter based on the object `created` field, greater than or equal to.'
          },
          created_lt: {
            type: 'integer',
            description: 'Filter based on the object `created` field, less than.'
          },
          created_lte: {
            type: 'integer',
            description: 'Filter based on the object `created` field, less than or equal to.'
          },
          currency: {
            type: 'string',
            description: 'Only return prices for the given currency.'
          },
          ending_before: {
            type: 'string',
            description: 'Cursor for pagination, ending before this object ID.'
          },
          expand: {
            type: 'string',
            description: 'Specifies which fields in the response should be expanded.'
          },
          limit: {
            type: 'integer',
            description: 'A limit on the number of objects to be returned.'
          },
          lookup_keys: {
            type: 'string',
            description: 'Only return the price with these lookup_keys.'
          },
          product: {
            type: 'string',
            description: 'Only return prices for the given product.'
          },
          recurring: {
            type: 'string',
            description: 'Only return prices with these recurring fields.'
          },
          starting_after: {
            type: 'string',
            description: 'Cursor for pagination, starting after this object ID.'
          },
          type: {
            type: 'string',
            description: 'Only return prices of type `recurring` or `one_time`.'
          }
        }
      }
    }
  }
};

export { apiTool };