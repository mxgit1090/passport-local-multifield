/* global describe, it, expect, before */

var chai = require('chai');
var Strategy = require('../lib/strategy');

describe('Strategy', function() {
  var testErrorThat = function(message, strategy) {
    describe(message, function() {
      var err = null;

      before(function(done) {
        chai.passport.use(strategy)
          .error(function(e) {
            err = e;
            done();
          })
          .req(function(req) {
            req.body = {};
            req.body.zuzhi = 'company';
            req.body.mingcheng = 'john';
            req.body.mima = 'smith';
          })
          .authenticate();
      });

      it('should error', function() {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal(message);
      });
    });
  }
  
  var message1 = 'encountering an error during verification';
  testErrorThat(message1, new Strategy(
    { fields: ['organization', 'username', 'password'] },
    function(data, done) {
      done(new Error(message1));
    },
  ));

  var message2 = 'encountering an exception during verification';
  testErrorThat(message2, new Strategy(
    { fields: ['organization', 'username', 'password'] },
    function() {
      throw new Error(message2);
    },
  ));
});
