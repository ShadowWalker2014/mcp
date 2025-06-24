/**
 * Function to update a coupon in Stripe.
 *
 * @param {Object} args - Arguments for the coupon update.
 * @param {string} args.coupon - The ID of the coupon to update.
 * @param {string} [args.name] - The name of the coupon displayed to customers.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The result of the coupon update.
 */
const executeFunction = async ({ coupon, name, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;

  try {
    const url = new URL(`${baseUrl}/v1/coupons/${coupon}`);
    
    // Prepare the form data
    const formData = new URLSearchParams();
    if (name) formData.append('name', name);
    expand.forEach((item, index) => {
      formData.append(`expand[${index}]`, item);
    });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Stripe Postman Collection Apr 16 2024'
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: formData
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
    console.error('Error updating coupon:', error);
    return { error: 'An error occurred while updating the coupon.' };
  }
};

/**
 * Tool configuration for updating a coupon in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_coupon',
      description: 'Update a coupon in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          coupon: {
            type: 'string',
            description: 'The ID of the coupon to update.'
          },
          name: {
            type: 'string',
            description: 'The name of the coupon displayed to customers.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Specifies which fields in the response should be expanded.'
            },
            description: 'Fields to expand in the response.'
          }
        },
        required: ['coupon']
      }
    }
  }
};

export { apiTool };