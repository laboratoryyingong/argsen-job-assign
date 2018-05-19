/**
 * Ticket.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    ticket:{
      type: 'string',
    },

    recipients:{
      type: 'ref',
    },

    title:{
      type: 'string',
    },

    comment:{
      type: 'string',
    },

    reference:{
      type: 'string',
    },

    isEmailAttached:{
      type: 'boolean',
    }

  },

};

