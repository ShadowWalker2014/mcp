/**
 * Function to update a product in Stripe.
 *
 * @param {Object} args - Arguments for updating the product.
 * @param {string} args.id - The ID of the product to update.
 * @param {boolean} [args.active] - Whether the product is available for purchase.
 * @param {string} [args.default_price] - The ID of the default price for this product.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @param {Array<string>} [args.images] - A list of URLs of images for this product.
 * @param {Array<Object>} [args.marketing_features] - A list of marketing features for this product.
 * @param {string} [args.name] - The product's name.
 * @param {Object} [args.package_dimensions] - The dimensions of this product for shipping purposes.
 * @param {boolean} [args.shippable] - Whether this product is shipped (i.e., physical goods).
 * @param {string} [args.statement_descriptor] - An arbitrary string to be displayed on the customer's statement.
 * @returns {Promise<Object>} - The result of the product update.
 */
const executeFunction = async ({ id, active, default_price, expand, images, marketing_features, name, package_dimensions, shippable, statement_descriptor }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;

  try {
    // Construct the URL for the product update
    const url = new URL(`${baseUrl}/v1/products/${id}`);

    // Prepare form data
    const formData = new URLSearchParams();
    if (active !== undefined) formData.append('active', active);
    if (default_price) formData.append('default_price', default_price);
    if (expand) expand.forEach(exp => formData.append('expand[]', exp));
    if (images) images.forEach(img => formData.append('images[]', img));
    if (marketing_features) marketing_features.forEach(feature => formData.append('marketing_features[]', JSON.stringify(feature)));
    if (name) formData.append('name', name);
    if (package_dimensions) {
      if (package_dimensions.height) formData.append('package_dimensions[height]', package_dimensions.height);
      if (package_dimensions.length) formData.append('package_dimensions[length]', package_dimensions.length);
      if (package_dimensions.weight) formData.append('package_dimensions[weight]', package_dimensions.weight);
      if (package_dimensions.width) formData.append('package_dimensions[width]', package_dimensions.width);
    }
    if (shippable !== undefined) formData.append('shippable', shippable);
    if (statement_descriptor) formData.append('statement_descriptor', statement_descriptor);

    // Set up headers for the request
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
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
    console.error('Error updating product:', error);
    return { error: 'An error occurred while updating the product.' };
  }
};

/**
 * Tool configuration for updating a product in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_product',
      description: 'Update a product in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the product to update.'
          },
          active: {
            type: 'boolean',
            description: 'Whether the product is available for purchase.'
          },
          default_price: {
            type: 'string',
            description: 'The ID of the default price for this product.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Specifies which fields in the response should be expanded.'
          },
          images: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'A list of URLs of images for this product.'
          },
          marketing_features: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'A list of marketing features for this product.'
          },
          name: {
            type: 'string',
            description: 'The product\'s name.'
          },
          package_dimensions: {
            type: 'object',
            properties: {
              height: { type: 'number' },
              length: { type: 'number' },
              weight: { type: 'number' },
              width: { type: 'number' }
            },
            description: 'The dimensions of this product for shipping purposes.'
          },
          shippable: {
            type: 'boolean',
            description: 'Whether this product is shipped (i.e., physical goods).'
          },
          statement_descriptor: {
            type: 'string',
            description: 'An arbitrary string to be displayed on the customer\'s statement.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };