const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const Auth = require('../controllers/auth')
const User = require('../models/user');
router.post('/register', [
    body('email')
    .isEmail()
    .withMessage('Please enter a vaild email')
    .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
            return Promise.reject('Emial address already exists!');
        }
    }),
    body('password')
    .trim()
    .isLength({min: 8}),
    body('name')
    .trim()
    .notEmpty(),
    body('roomNo')
    .trim()
    .notEmpty()
],Auth.register)

router.get('', Auth.getUsers);

router.get('/user', Auth.checkEmail)

router.post('/login', Auth.logIn)


module.exports = router;