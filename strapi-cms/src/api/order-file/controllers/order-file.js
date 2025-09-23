'use strict';

/**
 * order-file controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order-file.order-file', ({ strapi }) => ({
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

  async create(ctx) {
    // Add file upload validation and processing
    const { data, meta } = await super.create(ctx);
    return { data, meta };
  },
}));
