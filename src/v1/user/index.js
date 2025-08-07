const router = require('express').Router();

const signUp = require('./signup.route');
const editUser = require('./edit.route');
const authUser = require('./login.route');
const getUser = require('./get.route');
const followUser = require('./follow.route');
const unfollowUser = require('./unfollow.route');

router.use(signUp, editUser, authUser, getUser, followUser, unfollowUser);

module.exports = router;