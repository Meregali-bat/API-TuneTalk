const router = require('express').Router();

const userRoutes = require('./user/index');

router.use('/usuario', userRoutes);

module.exports = router;