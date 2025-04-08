const router = require('express').Router();

const signUp = require('./signup.route');
const editUser = require('./edituser.route');
const authUser = require('./authuser.route');

router.use(signUp, editUser, authUser);

module.exports = router;