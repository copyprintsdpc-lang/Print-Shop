'use strict';

/**
 * category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({ strapi }) => ({
  // Custom controller methods can be added here
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    
    // Add custom logic here if needed
    return { data, meta };
  },

  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    
    // Add custom logic here if needed
    return { data, meta };
  },
}));
