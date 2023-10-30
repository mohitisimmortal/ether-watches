const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { signupUser, loginUser, deleteUser, updateUserDetails, requestPasswordReset, resetPassword, getUserProfile, updateUserPassword } = require('../controllers/userController');

// user routes
router.route('/signup').post(signupUser);
router.route('/login').post(loginUser);
router.route('/profile').get(authenticateToken, getUserProfile);
router.route('/delete/:id').delete(authenticateToken, deleteUser);
router.route('/update/:id').put(authenticateToken, updateUserDetails);
router.route('/updatepassword/:id').put(authenticateToken, updateUserPassword);
router.route('/request-password-reset').post(requestPasswordReset);
router.route('/reset-password').post(resetPassword);

module.exports = router;