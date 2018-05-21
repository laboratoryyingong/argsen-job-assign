/**
 * Userlog.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    user:{
      type: 'string',
    },

    password:{
      type: 'string'
    }

  },

};

