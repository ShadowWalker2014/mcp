/**
 * Function to create a coupon in Stripe.
 *
 * @param {Object} args - Arguments for creating a coupon.
 * @param {number} [args.amount_off] - A positive integer representing the amount to subtract from an invoice total (required if `percent_off` is not passed).
 * @param {Array<string>} [args.applies_to] - A hash containing directions for what this Coupon will apply discounts to.
 * @param {string} [args.currency] - Three-letter ISO code for the currency of the `amount_off` parameter (required if `amount_off` is passed).
 * @param {string} [args.duration] - Specifies how long the discount will be in effect if used on a subscription. Defaults to `once`.
 * @param {number} [args.duration_in_months] - Required only if `duration` is `repeating`, specifies the number of months the discount will be in effect.
 * @param {Array<string>} [args.expand] - Specifies which fields in the response should be expanded.
 * @param {string} [args.id] - Unique string of your choice that will be used to identify this coupon when applying it to a customer.
 * @param {number} [args.max_redemptions] - A positive integer specifying the number of times the coupon can be redeemed before it's no longer valid.
 * @param {string} [args.name] - Name of the coupon displayed to customers on invoices or receipts.
 * @param {number} [args.percent_off] - A positive float larger than 0, and smaller or equal to 100, that represents the discount the coupon will apply (required if `amount_off` is not passed).
 * @param {number} [args.redeem_by] - Unix timestamp specifying the last time at which the coupon can be redeemed.
 * @returns {Promise<Object>} - The result of the coupon creation.
 */
const executeFunction = async ({
  amount_off,
  applies_to,
  currency,
  duration,
  duration_in_months,
  expand,
  id,
  max_redemptions,
  name,
  percent_off,
  redeem_by
}) => {
  const baseUrl = 'https://api.stripe.com/v1/coupons';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;

  const params = new URLSearchParams();
  if (amount_off) params.append('amount_off', amount_off);
  if (applies_to) applies_to.forEach(product => params.append('applies_to[products][]', product));
  if (currency) params.append('currency', currency);
  if (duration) params.append('duration', duration);
  if (duration_in_months) params.append('duration_in_months', duration_in_months);
  if (expand) expand.forEach(expandField => params.append('expand[]', expandField));
  if (id) params.append('id', id);
  if (max_redemptions) params.append('max_redemptions', max_redemptions);
  if (name) params.append('name', name);
  if (percent_off) params.append('percent_off', percent_off);
  if (redeem_by) params.append('redeem_by', redeem_by);

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    return { error: 'An error occurred while creating the coupon.' };
  }
};

/**
 * Tool configuration for creating a coupon in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_coupon',
      description: 'Create a coupon in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          amount_off: {
            type: 'number',
            description: 'A positive integer representing the amount to subtract from an invoice total.'
          },
          applies_to: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'A hash containing directions for what this Coupon will apply discounts to.'
          },
          currency: {
            type: 'string',
            description: 'Three-letter ISO code for the currency of the amount_off parameter.'
          },
          duration: {
            type: 'string',
            description: 'Specifies how long the discount will be in effect if used on a subscription.'
          },
          duration_in_months: {
            type: 'number',
            description: 'Required only if duration is repeating, specifies the number of months the discount will be in effect.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Specifies which fields in the response should be expanded.'
          },
          id: {
            type: 'string',
            description: 'Unique string of your choice that will be used to identify this coupon.'
          },
          max_redemptions: {
            type: 'number',
            description: 'A positive integer specifying the number of times the coupon can be redeemed.'
          },
          name: {
            type: 'string',
            description: 'Name of the coupon displayed to customers on invoices or receipts.'
          },
          percent_off: {
            type: 'number',
            description: 'A positive float representing the discount the coupon will apply.'
          },
          redeem_by: {
            type: 'number',
            description: 'Unix timestamp specifying the last time at which the coupon can be redeemed.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };