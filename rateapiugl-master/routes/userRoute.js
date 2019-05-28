const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/userCtrl');

router.get('/home/:email', UserCtrl.homePage);


router.post('/singup/user', UserCtrl.createUser);
router.post('/login/user', UserCtrl.loginUser);

module.exports = router;

