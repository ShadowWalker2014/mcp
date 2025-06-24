/**
 * Function to search for prices using Stripe's Search Query Language.
 *
 * @param {Object} args - Arguments for the search.
 * @param {string} args.query - The search query string (required).
 * @param {number} [args.limit=10] - A limit on the number of objects to be returned (1-100).
 * @param {string} [args.page] - A cursor for pagination across multiple pages of results.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The result of the price search.
 */
const executeFunction = async ({ query, limit = 10, page, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/prices/search`);
    url.searchParams.append('query', query);
    if (limit) url.searchParams.append('limit', limit.toString());
    if (page) url.searchParams.append('page', page);
    expand.forEach(expandParam => url.searchParams.append('expand[]', expandParam));

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
    console.error('Error searching for prices:', error);
    return { error: 'An error occurred while searching for prices.' };
  }
};

/**
 * Tool configuration for searching prices using Stripe's API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'search_prices',
      description: 'Search for prices using Stripe’s Search Query Language.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query string (required).'
          },
          limit: {
            type: 'integer',
            description: 'A limit on the number of objects to be returned (1-100).'
          },
          page: {
            type: 'string',
            description: 'A cursor for pagination across multiple pages of results.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Specifies which fields in the response should be expanded.'
            },
            description: 'Array of fields to expand in the response.'
          }
        },
        required: ['query']
      }
    }
  }
};

export { apiTool };