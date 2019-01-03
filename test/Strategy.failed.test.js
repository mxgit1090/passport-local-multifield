/* global describe, it, expect, before */

var chai = require('chai');
var Strategy = require('../lib/strategy');

describe('Strategy', function() {
  var testFailureThat = function(message, strategy, shouldFailedCallback) {
    describe(message, function() {
      var info = null;

      before(function(done) {
        chai.passport.use(strategy)
          .fail(function(i) {
            info = i;
            done();
          })
          .req(function(req) {
            req.body = {};
            req.body.organization = 'company';
            req.body.username = 'john';
            req.body.password = 'smith';
          })
          .authenticate();
      });

      it('should failed', function() {
        shouldFailedCallback(info);
      });
    });
  }

  testFailureThat(
    'failing authentication',
    new Strategy(
      { fields: ['organization', 'username', 'password'] },
      function(data, done) {
        done(null, false);
      },
    ),
    function(info) {
      expect(info).to.be.undefined;
    }
  );

  testFailureThat(
    'failing authentication with info',
    new Strategy(
      { fields: ['organization', 'username', 'password'] },
      function(data, done) {
        done(null, false, { message: 'login failure!' });
      },
    ),
    function(info) {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('login failure!');
    }
  );
});
