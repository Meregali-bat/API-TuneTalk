const router = require('express').Router();

const signUp = require('./signup.route');
const editUser = require('./edit.route');
const login = require('./login.route');
const getUser = require('./get.route');

router.use(signUp, editUser, login, getUser);

module.exports = router;