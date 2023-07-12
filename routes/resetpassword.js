const express = require('express');

const resetpasswordController = require('../controller/resetpassword');
const router = express.Router();
const authenticatemiddleware = require('../middleware/auth');
router.get('/updatepassword/:resetpasswordid', authenticatemiddleware.authenticate,resetpasswordController.updatepassword)
router.get('/resetpassword/:id', authenticatemiddleware.authenticate,resetpasswordController.resetpassword)
router.use('/forgotpassword',authenticatemiddleware.authenticate, resetpasswordController.forgotpassword)

module.exports = router;