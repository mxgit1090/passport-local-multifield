/* global describe, it, expect */
var Strategy = require('../lib/strategy');

describe('Strategy', function() {
    var strategy = new Strategy({ fields: ['key'] }, function(){});

    it('should be named local', function() {
      expect(strategy.name).to.equal('local-multifield');
    });

    it('should throw if constructed without an option object', function() {
      expect(function() {
        var s = new Strategy();
      }).to.throw(TypeError, 'MultiFieldLocalStrategy requires an option object');
    });

    it('should throw if constructed without a verify callback', function() {
      expect(function() {
        var s = new Strategy({});
      }).to.throw(TypeError, 'MultiFieldLocalStrategy requires a verify callback');
    });

    it('should throw if constructed without required properties', function() {
      expect(function() {
        var s = new Strategy({}, function() {});
      }).to.throw(TypeError, 'Property \'fields\' is required!');
    });

    it('should throw if constructed with empty fields array', function() {
      expect(function() {
        var s = new Strategy({ fields: [] }, function() {});
      }).to.throw(TypeError, 'Array \'fields\' must have at least one string');
    });

    it('should throw if constructed with empty fields object', function() {
      expect(function() {
        var s = new Strategy({ fields: {} }, function() {});
      }).to.throw(TypeError, 'Object \'fields\' must have at least one key-value pair');
    });
});
