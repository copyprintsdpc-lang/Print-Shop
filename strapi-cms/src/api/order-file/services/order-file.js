'use strict';

/**
 * order-file service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::order-file.order-file', ({ strapi }) => ({
  // Custom service methods can be added here
}));
