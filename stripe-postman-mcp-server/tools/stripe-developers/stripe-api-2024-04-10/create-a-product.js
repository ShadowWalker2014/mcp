/**
 * Function to create a new product in Stripe.
 *
 * @param {Object} args - Arguments for creating the product.
 * @param {string} args.name - The product's name, meant to be displayable to the customer. (Required)
 * @param {boolean} [args.active=true] - Whether the product is currently available for purchase.
 * @param {string} [args.default_price_data_currency] - Currency for the default price.
 * @param {Object} [args.default_price_data_currency_options] - Currency options for the default price.
 * @param {string} [args.default_price_data_recurring_interval] - Recurring interval for the default price.
 * @param {number} [args.default_price_data_recurring_interval_count] - Count of the recurring interval.
 * @param {string} [args.default_price_data_tax_behavior] - Tax behavior for the default price.
 * @param {number} [args.default_price_data_unit_amount] - Unit amount for the default price.
 * @param {string} [args.default_price_data_unit_amount_decimal] - Decimal unit amount for the default price.
 * @param {string} [args.description] - The product's description.
 * @param {Array<string>} [args.images] - A list of URLs of images for this product.
 * @param {string} [args.statement_descriptor] - A descriptor for the customer's statement.
 * @param {string} [args.unit_label] - A label that represents units of this product.
 * @param {string} [args.url] - A URL of a publicly-accessible webpage for this product.
 * @returns {Promise<Object>} - The result of the product creation.
 */
const executeFunction = async ({ 
  name, 
  active = true, 
  default_price_data_currency, 
  default_price_data_currency_options, 
  default_price_data_recurring_interval, 
  default_price_data_recurring_interval_count, 
  default_price_data_tax_behavior, 
  default_price_data_unit_amount, 
  default_price_data_unit_amount_decimal, 
  description, 
  images = [], 
  statement_descriptor, 
  unit_label, 
  url 
}) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  // Construct the body for the request
  const body = new URLSearchParams();
  body.append('name', name);
  body.append('active', active);
  if (default_price_data_currency) body.append('default_price_data[currency]', default_price_data_currency);
  if (default_price_data_currency_options) body.append('default_price_data[currency_options]', JSON.stringify(default_price_data_currency_options));
  if (default_price_data_recurring_interval) body.append('default_price_data[recurring][interval]', default_price_data_recurring_interval);
  if (default_price_data_recurring_interval_count) body.append('default_price_data[recurring][interval_count]', default_price_data_recurring_interval_count);
  if (default_price_data_tax_behavior) body.append('default_price_data[tax_behavior]', default_price_data_tax_behavior);
  if (default_price_data_unit_amount) body.append('default_price_data[unit_amount]', default_price_data_unit_amount);
  if (default_price_data_unit_amount_decimal) body.append('default_price_data[unit_amount_decimal]', default_price_data_unit_amount_decimal);
  if (description) body.append('description', description);
  images.forEach((image, index) => body.append(`images[${index}]`, image));
  if (statement_descriptor) body.append('statement_descriptor', statement_descriptor);
  if (unit_label) body.append('unit_label', unit_label);
  if (url) body.append('url', url);

  try {
    // Perform the fetch request
    const response = await fetch(`${baseUrl}v1/products`, {
      method: 'POST',
      headers: {
        ...headers,
        'Authorization': `Bearer ${token}`
      },
      body: body.toString(),
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
    console.error('Error creating product:', error);
    return { error: 'An error occurred while creating the product.' };
  }
};

/**
 * Tool configuration for creating a product in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_product',
      description: 'Create a new product in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The product\'s name, meant to be displayable to the customer.'
          },
          active: {
            type: 'boolean',
            description: 'Whether the product is currently available for purchase.'
          },
          default_price_data_currency: {
            type: 'string',
            description: 'Currency for the default price.'
          },
          default_price_data_currency_options: {
            type: 'object',
            description: 'Currency options for the default price.'
          },
          default_price_data_recurring_interval: {
            type: 'string',
            description: 'Recurring interval for the default price.'
          },
          default_price_data_recurring_interval_count: {
            type: 'integer',
            description: 'Count of the recurring interval.'
          },
          default_price_data_tax_behavior: {
            type: 'string',
            description: 'Tax behavior for the default price.'
          },
          default_price_data_unit_amount: {
            type: 'integer',
            description: 'Unit amount for the default price.'
          },
          default_price_data_unit_amount_decimal: {
            type: 'string',
            description: 'Decimal unit amount for the default price.'
          },
          description: {
            type: 'string',
            description: 'The product\'s description.'
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              description: 'A list of URLs of images for this product.'
            },
            description: 'A list of URLs of images for this product.'
          },
          statement_descriptor: {
            type: 'string',
            description: 'A descriptor for the customer\'s statement.'
          },
          unit_label: {
            type: 'string',
            description: 'A label that represents units of this product.'
          },
          url: {
            type: 'string',
            description: 'A URL of a publicly-accessible webpage for this product.'
          }
        },
        required: ['name']
      }
    }
  }
};

export { apiTool };