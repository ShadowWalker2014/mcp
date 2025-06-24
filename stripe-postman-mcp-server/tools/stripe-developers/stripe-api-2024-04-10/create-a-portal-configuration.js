/**
 * Function to create a portal configuration in Stripe.
 *
 * @param {Object} args - Arguments for the portal configuration.
 * @param {string} args.business_profile_headline - The business information shown to customers in the portal.
 * @param {string} args.business_profile_privacy_policy_url - The URL for the business's privacy policy.
 * @param {string} args.business_profile_terms_of_service_url - The URL for the business's terms of service.
 * @param {boolean} args.features_customer_update_enabled - Whether customer updates are enabled.
 * @param {Array<string>} args.features_customer_update_allowed_updates - The allowed updates for customer information.
 * @param {boolean} args.features_invoice_history_enabled - Whether invoice history is enabled.
 * @param {boolean} args.features_payment_method_update_enabled - Whether payment method updates are enabled.
 * @param {boolean} args.features_subscription_cancel_enabled - Whether subscription cancellation is enabled.
 * @param {boolean} args.features_subscription_cancel_cancellation_reason_enabled - Whether cancellation reasons are enabled.
 * @param {Array<string>} args.features_subscription_cancel_cancellation_reason_options - The options for cancellation reasons.
 * @param {string} args.features_subscription_cancel_mode - The mode for subscription cancellation.
 * @param {string} args.features_subscription_cancel_proration_behavior - The proration behavior for subscription cancellation.
 * @param {Array<string>} args.features_subscription_update_default_allowed_updates - The default allowed updates for subscriptions.
 * @param {boolean} args.features_subscription_update_enabled - Whether subscription updates are enabled.
 * @param {Array<string>} args.features_subscription_update_products - The products involved in subscription updates.
 * @param {string} args.features_subscription_update_proration_behavior - The proration behavior for subscription updates.
 * @returns {Promise<Object>} - The result of the portal configuration creation.
 */
const executeFunction = async (args) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;

  const formData = new URLSearchParams();
  formData.append('business_profile[headline]', args.business_profile_headline);
  formData.append('business_profile[privacy_policy_url]', args.business_profile_privacy_policy_url);
  formData.append('business_profile[terms_of_service_url]', args.business_profile_terms_of_service_url);
  formData.append('features[customer_update][enabled]', args.features_customer_update_enabled);
  formData.append('features[customer_update][allowed_updates][0]', args.features_customer_update_allowed_updates[0]);
  formData.append('features[customer_update][allowed_updates][1]', args.features_customer_update_allowed_updates[1]);
  formData.append('features[invoice_history][enabled]', args.features_invoice_history_enabled);
  formData.append('features[payment_method_update][enabled]', args.features_payment_method_update_enabled);
  formData.append('features[subscription_cancel][enabled]', args.features_subscription_cancel_enabled);
  formData.append('features[subscription_cancel][cancellation_reason][enabled]', args.features_subscription_cancel_cancellation_reason_enabled);
  formData.append('features[subscription_cancel][cancellation_reason][options][0]', args.features_subscription_cancel_cancellation_reason_options[0]);
  formData.append('features[subscription_cancel][cancellation_reason][options][1]', args.features_subscription_cancel_cancellation_reason_options[1]);
  formData.append('features[subscription_cancel][mode]', args.features_subscription_cancel_mode);
  formData.append('features[subscription_cancel][proration_behavior]', args.features_subscription_cancel_proration_behavior);
  formData.append('features[subscription_update][default_allowed_updates][0]', args.features_subscription_update_default_allowed_updates[0]);
  formData.append('features[subscription_update][default_allowed_updates][1]', args.features_subscription_update_default_allowed_updates[1]);
  formData.append('features[subscription_update][enabled]', args.features_subscription_update_enabled);
  formData.append('features[subscription_update][products][0][prices][0]', args.features_subscription_update_products[0].prices[0]);
  formData.append('features[subscription_update][products][0][prices][1]', args.features_subscription_update_products[0].prices[1]);
  formData.append('features[subscription_update][products][0][product]', args.features_subscription_update_products[0].product);
  formData.append('features[subscription_update][products][1][prices][0]', args.features_subscription_update_products[1].prices[0]);
  formData.append('features[subscription_update][products][1][prices][1]', args.features_subscription_update_products[1].prices[1]);
  formData.append('features[subscription_update][products][1][product]', args.features_subscription_update_products[1].product);
  formData.append('features[subscription_update][proration_behavior]', args.features_subscription_update_proration_behavior);

  try {
    const response = await fetch(`${baseUrl}/v1/billing_portal/configurations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating portal configuration:', error);
    return { error: 'An error occurred while creating the portal configuration.' };
  }
};

/**
 * Tool configuration for creating a portal configuration in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_portal_configuration',
      description: 'Create a portal configuration in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          business_profile_headline: {
            type: 'string',
            description: 'The business information shown to customers in the portal.'
          },
          business_profile_privacy_policy_url: {
            type: 'string',
            description: 'The URL for the business\'s privacy policy.'
          },
          business_profile_terms_of_service_url: {
            type: 'string',
            description: 'The URL for the business\'s terms of service.'
          },
          features_customer_update_enabled: {
            type: 'boolean',
            description: 'Whether customer updates are enabled.'
          },
          features_customer_update_allowed_updates: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The allowed updates for customer information.'
          },
          features_invoice_history_enabled: {
            type: 'boolean',
            description: 'Whether invoice history is enabled.'
          },
          features_payment_method_update_enabled: {
            type: 'boolean',
            description: 'Whether payment method updates are enabled.'
          },
          features_subscription_cancel_enabled: {
            type: 'boolean',
            description: 'Whether subscription cancellation is enabled.'
          },
          features_subscription_cancel_cancellation_reason_enabled: {
            type: 'boolean',
            description: 'Whether cancellation reasons are enabled.'
          },
          features_subscription_cancel_cancellation_reason_options: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The options for cancellation reasons.'
          },
          features_subscription_cancel_mode: {
            type: 'string',
            description: 'The mode for subscription cancellation.'
          },
          features_subscription_cancel_proration_behavior: {
            type: 'string',
            description: 'The proration behavior for subscription cancellation.'
          },
          features_subscription_update_default_allowed_updates: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The default allowed updates for subscriptions.'
          },
          features_subscription_update_enabled: {
            type: 'boolean',
            description: 'Whether subscription updates are enabled.'
          },
          features_subscription_update_products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                prices: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },
                product: {
                  type: 'string'
                }
              }
            },
            description: 'The products involved in subscription updates.'
          },
          features_subscription_update_proration_behavior: {
            type: 'string',
            description: 'The proration behavior for subscription updates.'
          }
        },
        required: [
          'business_profile_headline',
          'business_profile_privacy_policy_url',
          'business_profile_terms_of_service_url',
          'features_customer_update_enabled',
          'features_customer_update_allowed_updates',
          'features_invoice_history_enabled',
          'features_payment_method_update_enabled',
          'features_subscription_cancel_enabled',
          'features_subscription_cancel_cancellation_reason_enabled',
          'features_subscription_cancel_cancellation_reason_options',
          'features_subscription_cancel_mode',
          'features_subscription_cancel_proration_behavior',
          'features_subscription_update_default_allowed_updates',
          'features_subscription_update_enabled',
          'features_subscription_update_products',
          'features_subscription_update_proration_behavior'
        ]
      }
    }
  }
};

export { apiTool };