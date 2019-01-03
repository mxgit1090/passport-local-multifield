# passport-local-multifield
The enhancement of <a href="https://github.com/jaredhanson/passport-local" target="_blank">passport-local</a> for multi-field form, more than two fields such as `username` and `password`.

## Usage
Mapping the fields from `req.body` or `req.query`:
```js
passport.use(new MultiFieldLocalStrategy(
    {
        fields: ['username', 'password', 'token'],
    },
    function(data, done) {
        User.findOne({ username: data.username }, function(err, user) {
            if (err) { return done(err); }
            else if (!user) { return done(null, false); }
            else if (!user.verifyPasswordAndToken(data.password, data.token)) { return done(null, false); }
            return done(null, user);
        });
    },
));
```

With mapping object:
```js
passport.use(new MultiFieldLocalStrategy(
    {
        fields: {
            username: 'account',
            password: 'passwd',
            token: 'accessToken',
        },
    },
    function(data, done) {
        // ...
    },
));
```

Passing the request object into verify callback:
```js
passport.use(new MultiFieldLocalStrategy(
    {
        fields: ['username', 'password', 'token'],
        passReqToCallback: true,
    },
    function(req, data, done) {
        // ...
    },
));
```

Authenicating request in <a href="https://expressjs.com" target="_blank">Express</a>:
```js
app.post('/login',
    passport.authenticate('local-multifield', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);
```