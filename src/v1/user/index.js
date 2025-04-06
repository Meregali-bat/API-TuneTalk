const router = require('express').Router();

const signUp = require('./signup.route');

router.use(signUp);

module.exports = router;