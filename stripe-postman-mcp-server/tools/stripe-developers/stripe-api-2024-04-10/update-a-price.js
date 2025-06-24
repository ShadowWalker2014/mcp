/**
 * Function to update a price in Stripe.
 *
 * @param {Object} args - Arguments for updating the price.
 * @param {string} args.price - The ID of the price to update.
 * @param {boolean} [args.active] - Whether the price can be used for new purchases. Defaults to `true`.
 * @param {string} [args.nickname] - A brief description of the price, hidden from customers.
 * @param {string} [args.lookup_key] - A lookup key used to retrieve prices dynamically from a static string.
 * @param {string} [args.tax_behavior] - Specifies whether the price is considered inclusive or exclusive of taxes.
 * @param {boolean} [args.transfer_lookup_key] - If set to true, will atomically remove the lookup key from the existing price, and assign it to this price.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @returns {Promise<Object>} - The result of the price update.
 */
const executeFunction = async ({ price, active, nickname, lookup_key, tax_behavior, transfer_lookup_key, expand }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  const url = `${baseUrl}v1/prices/${price}`;
  
  // Prepare the form data
  const formData = new URLSearchParams();
  if (active !== undefined) formData.append('active', active);
  if (nickname) formData.append('nickname', nickname);
  if (lookup_key) formData.append('lookup_key', lookup_key);
  if (tax_behavior) formData.append('tax_behavior', tax_behavior);
  if (transfer_lookup_key !== undefined) formData.append('transfer_lookup_key', transfer_lookup_key);
  if (expand) {
    expand.forEach((item, index) => {
      formData.append(`expand[${index}]`, item);
    });
  }

  try {
    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    // Perform the fetch request
    const response = await fetch(url, {
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
    console.error('Error updating price:', error);
    return { error: 'An error occurred while updating the price.' };
  }
};

/**
 * Tool configuration for updating a price in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_price',
      description: 'Update a price in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          price: {
            type: 'string',
            description: 'The ID of the price to update.'
          },
          active: {
            type: 'boolean',
            description: 'Whether the price can be used for new purchases. Defaults to `true`.'
          },
          nickname: {
            type: 'string',
            description: 'A brief description of the price, hidden from customers.'
          },
          lookup_key: {
            type: 'string',
            description: 'A lookup key used to retrieve prices dynamically from a static string.'
          },
          tax_behavior: {
            type: 'string',
            description: 'Specifies whether the price is considered inclusive or exclusive of taxes.'
          },
          transfer_lookup_key: {
            type: 'boolean',
            description: 'If set to true, will atomically remove the lookup key from the existing price, and assign it to this price.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Specifies which fields in the response should be expanded.'
          }
        },
        required: ['price']
      }
    }
  }
};

export { apiTool };