'use strict';

/**
 * category service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::category.category', ({ strapi }) => ({
  // Custom service methods can be added here
}));
