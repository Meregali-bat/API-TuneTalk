const router = require('express').Router();

const userRoutes = require('./user/index');

router.use('/user', userRoutes);

module.exports = router;
