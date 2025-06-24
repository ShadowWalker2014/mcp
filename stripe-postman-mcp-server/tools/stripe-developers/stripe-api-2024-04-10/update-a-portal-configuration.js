/**
 * Function to update a portal configuration in Stripe.
 *
 * @param {Object} args - Arguments for the update.
 * @param {string} args.configuration - The ID of the configuration to update.
 * @param {boolean} [args.active] - Whether the configuration is active.
 * @param {string} [args.business_profile_headline] - The business profile headline.
 * @param {string} [args.business_profile_privacy_policy_url] - The business profile privacy policy URL.
 * @param {string} [args.business_profile_terms_of_service_url] - The business profile terms of service URL.
 * @param {Array<string>} [args.expand] - Fields to expand in the response.
 * @param {Object} [args.features] - Features available in the portal.
 * @returns {Promise<Object>} - The result of the update operation.
 */
const executeFunction = async ({ configuration, active, business_profile_headline, business_profile_privacy_policy_url, business_profile_terms_of_service_url, expand, features }) => {
  const baseUrl = 'https://api.stripe.com/';
  const token = process.env.STRIPE_DEVELOPERS_API_KEY;
  const url = `${baseUrl}v1/billing_portal/configurations/${configuration}`;
  
  // Prepare the form data
  const formData = new URLSearchParams();
  if (active !== undefined) formData.append('active', active);
  if (business_profile_headline) formData.append('business_profile[headline]', business_profile_headline);
  if (business_profile_privacy_policy_url) formData.append('business_profile[privacy_policy_url]', business_profile_privacy_policy_url);
  if (business_profile_terms_of_service_url) formData.append('business_profile[terms_of_service_url]', business_profile_terms_of_service_url);
  if (expand) expand.forEach((item, index) => formData.append(`expand[${index}]`, item));
  if (features) {
    Object.keys(features).forEach(key => {
      formData.append(`features[${key}]`, features[key]);
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
    console.error('Error updating portal configuration:', error);
    return { error: 'An error occurred while updating the portal configuration.' };
  }
};

/**
 * Tool configuration for updating a portal configuration in Stripe.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'update_portal_configuration',
      description: 'Update a portal configuration in Stripe.',
      parameters: {
        type: 'object',
        properties: {
          configuration: {
            type: 'string',
            description: 'The ID of the configuration to update.'
          },
          active: {
            type: 'boolean',
            description: 'Whether the configuration is active.'
          },
          business_profile_headline: {
            type: 'string',
            description: 'The business profile headline.'
          },
          business_profile_privacy_policy_url: {
            type: 'string',
            description: 'The business profile privacy policy URL.'
          },
          business_profile_terms_of_service_url: {
            type: 'string',
            description: 'The business profile terms of service URL.'
          },
          expand: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Fields to expand in the response.'
          },
          features: {
            type: 'object',
            description: 'Features available in the portal.'
          }
        },
        required: ['configuration']
      }
    }
  }
};

export { apiTool };