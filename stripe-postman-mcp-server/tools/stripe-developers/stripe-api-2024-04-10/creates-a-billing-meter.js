/**
 * Function to create a billing meter in Stripe.
 *
 * @param {Object} args - Arguments for creating a billing meter.
 * @param {string} args.default_aggregation_formula - The default settings to aggregate a meter's events with.
 * @param {string} args.display_name - The meter's name.
 * @param {string} args.event_name - The name of the usage event to record usage for.
 * @param {string} [args.customer_mapping_event_payload_key] - Fields that specify how to map a meter event to a customer.
 * @param {string} [args.customer_mapping_type] - Fields that specify how to map a meter event to a customer.
 * @param {string} [args.event_time_window] - The time window to pre-aggregate usage events for, if any.
 * @param {string} [args.expand0] - Specifies which fields in the response should be expanded.
 * @param {string} [args.expand1] - Specifies which fields in the response should be expanded.
 * @param {string} [args.value_settings_event_payload_key] - Fields that specify how to calculate a usage event's value.
 * @returns {Promise<Object>} - The result of the billing meter creation.
 */
const executeFunction = async ({ default_aggregation_formula, display_name, event_name, customer_mapping_event_payload_key, customer_mapping_type, event_time_window, expand0, expand1, value_settings_event_payload_key }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;

  const params = new URLSearchParams();
  params.append('default_aggregation[formula]', default_aggregation_formula);
  params.append('display_name', display_name);
  params.append('event_name', event_name);
  if (customer_mapping_event_payload_key) {
    params.append('customer_mapping[event_payload_key]', customer_mapping_event_payload_key);
  }
  if (customer_mapping_type) {
    params.append('customer_mapping[type]', customer_mapping_type);
  }
  if (event_time_window) {
    params.append('event_time_window', event_time_window);
  }
  if (expand0) {
    params.append('expand[0]', expand0);
  }
  if (expand1) {
    params.append('expand[1]', expand1);
  }
  if (value_settings_event_payload_key) {
    params.append('value_settings[event_payload_key]', value_settings_event_payload_key);
  }

  try {
    const response = await fetch(`${baseUrl}/v1/billing/meters`, {
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
    console.error('Error creating billing meter:', error);
    return { error: 'An error occurred while creating the billing meter.' };
  }
};

/**
 * Tool configuration for creating a billing meter in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_billing_meter',
      description: 'Creates a billing meter in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          default_aggregation_formula: {
            type: 'string',
            description: 'The default settings to aggregate a meter\'s events with.'
          },
          display_name: {
            type: 'string',
            description: 'The meter\'s name.'
          },
          event_name: {
            type: 'string',
            description: 'The name of the usage event to record usage for.'
          },
          customer_mapping_event_payload_key: {
            type: 'string',
            description: 'Fields that specify how to map a meter event to a customer.'
          },
          customer_mapping_type: {
            type: 'string',
            description: 'Fields that specify how to map a meter event to a customer.'
          },
          event_time_window: {
            type: 'string',
            description: 'The time window to pre-aggregate usage events for, if any.'
          },
          expand0: {
            type: 'string',
            description: 'Specifies which fields in the response should be expanded.'
          },
          expand1: {
            type: 'string',
            description: 'Specifies which fields in the response should be expanded.'
          },
          value_settings_event_payload_key: {
            type: 'string',
            description: 'Fields that specify how to calculate a usage event\'s value.'
          }
        },
        required: ['default_aggregation_formula', 'display_name', 'event_name']
      }
    }
  }
};

export { apiTool };