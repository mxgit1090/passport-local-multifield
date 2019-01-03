/* global describe, it, expect, before */

var chai = require('chai');
var Strategy = require('../lib/strategy');

describe('Strategy', function() {
	describe('handling a request with valid credentials in body and passing request', function () {
		var strategy = new Strategy(
			{
				fields: ['organization', 'username', 'password'],
				passReqToCallback: true,
			},
			function(req, data, done) {
				if (
					data.organization === 'company'
					&& data.username === 'john'
					&& data.password === 'smith'
				) {
					done(null, { id: '1234' }, { isSucceed: true, cookie: req.cookies.taste, foo: req.headers['x-foo'] });
				}
				return done(null, false);
			}
		);

		var user = null;
		var info = null;

		before(function(done) {
			chai.passport.use(strategy)
				.success(function(u, i) {
					user = u;
					info = i;
					done();
				})
				.req(function(req) {
					req.body = {};
					req.body.organization = 'company';
					req.body.username = 'john';
					req.body.password = 'smith';
					
					req.cookies = { taste: 'chocolate' };
					req.headers = {};
					req.headers['x-foo'] = 'bar';
				})
				.authenticate();
		});

		it('should supply user', function() {
			expect(user).to.be.an.an('object');
			expect(user.id).to.equal('1234');
		});

		it('should supply info', function() {
			expect(info).to.be.an('object');
			expect(info.isSucceed).to.be.a('boolean');
			expect(info.isSucceed).to.equal(true);
		});

		it('should pass req into strategy verify function', function() {
			expect(info.cookie).to.equal('chocolate');
			expect(info.foo).to.equal('bar');
		});
	});
});
