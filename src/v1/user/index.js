const router = require('express').Router();

const signUp = require('./signup.route');
const editUser = require('./edit.route');
const authUser = require('./login.route');
const getUser = require('./get.route');

router.use(signUp, editUser, authUser, getUser);

module.exports = router;