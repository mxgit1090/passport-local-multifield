var passport = require('passport-strategy');
var util = require('util');
var {
  isPlainObject,
  getFromField,
} = require('./utils');

function MultiFieldLocalStrategy(options, verify) {
  if (!isPlainObject(options)) {
    throw new TypeError('MultiFieldLocalStrategy requires an option object');
  }

  if (typeof verify !== 'function') {
    throw new TypeError('MultiFieldLocalStrategy requires a verify callback');
  }

  /** `fields` is required, both Array or plainObject are acceptable */
  if (!Array.isArray(options.fields) && !isPlainObject(options.fields)) {
    throw new TypeError('Property \'fields\' is required!');
  }

  if (Array.isArray(options.fields) && options.fields.length === 0) {
    throw new TypeError('Array \'fields\' must have at least one string');
  }

  if (isPlainObject(options.fields) && Object.keys(options.fields).length === 0) {
    throw new TypeError('Object \'fields\' must have at least one key-value pair');
  }

  passport.Strategy.call(this);
  this.name = 'local-multifield';
  this._fields = options.fields;
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback || false;
}

util.inherits(MultiFieldLocalStrategy, passport.Strategy);

MultiFieldLocalStrategy.prototype.authenticate = function(req, options) {
  var self = this;
  var data = {};

  if (Array.isArray(self._fields)) {
    self._fields.forEach(function(field) {
      data[field] = getFromField(req.body, field) || getFromField(req.query, field);
    });
  } else if (isPlainObject(self._fields)) {
    Object.keys(self._fields).forEach(function(targetField) {
      var parsedField = self._fields[targetField];
      data[targetField] = getFromField(req.body, parsedField) || getFromField(req.query, parsedField);
    });
  }

  var verified = function(err, user, info) {
    if(err) {
      return self.error(err);
    } else if (!user) {
      return self.fail(info);
    }
    return self.success(user, info);
  };

  try {
    if (self._passReqToCallback) {
      this._verify(req, data, verified);
    } else {
      this._verify(data, verified);
    }
  } catch(ex) {
    self.error(ex);
  }
}

module.exports = MultiFieldLocalStrategy;
