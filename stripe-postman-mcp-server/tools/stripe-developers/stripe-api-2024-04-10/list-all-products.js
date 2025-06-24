/**
 * Function to list all products from the Stripe API.
 *
 * @param {Object} args - Arguments for listing products.
 * @param {boolean} [args.active] - Only return products that are active or inactive.
 * @param {number} [args.created_gt] - Only return products created after the given timestamp.
 * @param {number} [args.created_gte] - Only return products created on or after the given timestamp.
 * @param {number} [args.created_lt] - Only return products created before the given timestamp.
 * @param {number} [args.created_lte] - Only return products created on or before the given timestamp.
 * @param {string} [args.ending_before] - A cursor for pagination to fetch previous pages.
 * @param {string} [args.expand] - Specifies which fields in the response should be expanded.
 * @param {string[]} [args.ids] - Only return products with the given IDs.
 * @param {number} [args.limit] - A limit on the number of objects to be returned (1-100).
 * @param {boolean} [args.shippable] - Only return products that can be shipped.
 * @param {string} [args.starting_after] - A cursor for pagination to fetch next pages.
 * @param {string} [args.url] - Only return products with the given URL.
 * @returns {Promise<Object>} - The result of the product listing.
 */
const executeFunction = async (args = {}) => {
  const baseUrl = 'https://api.stripe.com/v1/products';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;

  try {
    // Construct the URL with query parameters
    const url = new URL(baseUrl);
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
    console.error('Error listing products:', error);
    return { error: 'An error occurred while listing products.' };
  }
};

/**
 * Tool configuration for listing products from the Stripe API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_all_products',
      description: 'List all products from the Stripe API.',
      parameters: {
        type: 'object',
        properties: {
          active: {
            type: 'boolean',
            description: 'Only return products that are active or inactive.'
          },
          created_gt: {
            type: 'integer',
            description: 'Only return products created after the given timestamp.'
          },
          created_gte: {
            type: 'integer',
            description: 'Only return products created on or after the given timestamp.'
          },
          created_lt: {
            type: 'integer',
            description: 'Only return products created before the given timestamp.'
          },
          created_lte: {
            type: 'integer',
            description: 'Only return products created on or before the given timestamp.'
          },
          ending_before: {
            type: 'string',
            description: 'A cursor for pagination to fetch previous pages.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Specifies which fields in the response should be expanded.'
          },
          ids: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Only return products with the given IDs.'
          },
          limit: {
            type: 'integer',
            description: 'A limit on the number of objects to be returned (1-100).'
          },
          shippable: {
            type: 'boolean',
            description: 'Only return products that can be shipped.'
          },
          starting_after: {
            type: 'string',
            description: 'A cursor for pagination to fetch next pages.'
          },
          url: {
            type: 'string',
            description: 'Only return products with the given URL.'
          }
        }
      }
    }
  }
};

export { apiTool };