const router = require('express').Router();

const signUp = require('./signup.route');
const editUser = require('./edituser.route');
const authUser = require('./authuser.route');
const getUser = require('./getuser.route');

router.use(signUp, editUser, authUser, getUser);

module.exports = router;