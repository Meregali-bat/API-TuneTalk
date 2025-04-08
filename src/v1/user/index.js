const router = require('express').Router();

const signUp = require('./signup.route');
const editUser = require('./edituser.route');

router.use(signUp, editUser);

module.exports = router;