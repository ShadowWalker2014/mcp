/**
 * Function to update a billing meter in Stripe.
 *
 * @param {Object} args - Arguments for updating the billing meter.
 * @param {string} args.id - The unique identifier for the billing meter.
 * @param {string} [args.display_name] - The meter's name.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The result of the billing meter update.
 */
const executeFunction = async ({ id, display_name, expand = [] }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  try {
    // Construct the URL for the request
    const url = `${baseUrl}v1/billing/meters/${id}`;

    // Prepare the form data
    const formData = new URLSearchParams();
    if (display_name) formData.append('display_name', display_name);
    expand.forEach((exp, index) => {
      formData.append(`expand[${index}]`, exp);
    });

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // If a token is provided, add it to the Authorization header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
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
    console.error('Error updating billing meter:', error);
    return { error: 'An error occurred while updating the billing meter.' };
  }
};

/**
 * Tool configuration for updating a billing meter in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_billing_meter',
      description: 'Updates a billing meter in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique identifier for the billing meter.'
          },
          display_name: {
            type: 'string',
            description: 'The meter\'s name.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Specifies which fields in the response should be expanded.'
            },
            description: 'Specifies which fields in the response should be expanded.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };