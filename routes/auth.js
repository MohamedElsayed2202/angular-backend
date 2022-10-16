const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const Auth = require('../controllers/auth')
const User = require('../models/user');
const isAuth = require('../middlewares/is-auth');

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
    body('type')
    .trim()
    .notEmpty()
],Auth.register)

router.get('', isAuth,Auth.getUsers);

router.get('/user', Auth.checkEmail)

router.get('/user/:id', Auth.getById)

router.post('/login', Auth.logIn)

router.put('/:id', isAuth, Auth.updateUser);

router.delete('/:id',isAuth, Auth.deleteUser);



module.exports = router;