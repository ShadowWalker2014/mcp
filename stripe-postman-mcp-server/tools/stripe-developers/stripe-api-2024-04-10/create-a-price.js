/**
 * Function to create a new price for an existing product in Stripe.
 *
 * @param {Object} args - Arguments for creating a price.
 * @param {string} args.currency - The three-letter ISO currency code (in lowercase).
 * @param {boolean} [args.active=true] - Whether the price can be used for new purchases.
 * @param {string} [args.billing_scheme] - Describes how to compute the price per period.
 * @param {number} [args.unit_amount] - A positive integer representing how much to charge.
 * @param {number} [args.unit_amount_decimal] - A decimal value representing how much to charge.
 * @param {Object} [args.product_data] - Fields to create a new product that this price will belong to.
 * @returns {Promise<Object>} - The result of the price creation.
 */
const executeFunction = async ({
  currency,
  active = true,
  billing_scheme,
  unit_amount,
  unit_amount_decimal,
  product_data
}) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  const url = `${baseUrl}v1/prices`;

  const body = new URLSearchParams();
  body.append('currency', currency);
  body.append('active', active);
  if (billing_scheme) body.append('billing_scheme', billing_scheme);
  if (unit_amount) body.append('unit_amount', unit_amount);
  if (unit_amount_decimal) body.append('unit_amount_decimal', unit_amount_decimal);
  if (product_data) {
    for (const [key, value] of Object.entries(product_data)) {
      body.append(`product_data[${key}]`, value);
    }
  }

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: body.toString()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating price:', error);
    return { error: 'An error occurred while creating the price.' };
  }
};

/**
 * Tool configuration for creating a price in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_price',
      description: 'Create a new price for an existing product in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          currency: {
            type: 'string',
            description: 'The three-letter ISO currency code (in lowercase).'
          },
          active: {
            type: 'boolean',
            description: 'Whether the price can be used for new purchases.'
          },
          billing_scheme: {
            type: 'string',
            description: 'Describes how to compute the price per period.'
          },
          unit_amount: {
            type: 'integer',
            description: 'A positive integer representing how much to charge.'
          },
          unit_amount_decimal: {
            type: 'number',
            description: 'A decimal value representing how much to charge.'
          },
          product_data: {
            type: 'object',
            description: 'Fields to create a new product that this price will belong to.'
          }
        },
        required: ['currency']
      }
    }
  }
};

export { apiTool };