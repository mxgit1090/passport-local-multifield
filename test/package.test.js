/* global describe, it, expect */
var strategy = require('..');

describe('passport-local-multifield', function() {  
  it('should exported as a contructor', function() {
    expect(strategy).to.be.a('function');
    expect(strategy).to.equal(strategy.Strategy);
  });
});
