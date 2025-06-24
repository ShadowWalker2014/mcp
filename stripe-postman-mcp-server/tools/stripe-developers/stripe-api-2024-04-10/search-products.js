/**
 * Function to search for products in Stripe.
 *
 * @param {Object} args - Arguments for the search.
 * @param {string} args.query - The search query string. See Stripe's search query language for more details.
 * @param {number} [args.limit=10] - A limit on the number of objects to be returned. Limit can range between 1 and 100.
 * @param {string} [args.page] - A cursor for pagination across multiple pages of results.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The result of the product search.
 */
const executeFunction = async ({ query, limit = 10, page, expand }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/products/search`);
    url.searchParams.append('query', query);
    if (limit) url.searchParams.append('limit', limit.toString());
    if (page) url.searchParams.append('page', page);
    if (expand) expand.forEach(expandParam => url.searchParams.append('expand[]', expandParam));

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // If a token is provided, add it to the Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

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
    console.error('Error searching for products:', error);
    return { error: 'An error occurred while searching for products.' };
  }
};

/**
 * Tool configuration for searching products in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'search_products',
      description: 'Search for products in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query string.'
          },
          limit: {
            type: 'integer',
            description: 'A limit on the number of objects to be returned.'
          },
          page: {
            type: 'string',
            description: 'A cursor for pagination across multiple pages of results.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Specifies which fields in the response should be expanded.'
          }
        },
        required: ['query']
      }
    }
  }
};

export { apiTool };