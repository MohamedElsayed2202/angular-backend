const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorThrewer = require('../helpers/error');
class Auth {
    static register = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
            errorThrewer(422, 'Validation faild.');
            }
            const encPassword = await bcrypt.hash(req.body.password, 12);
            req.body.password = encPassword;
            const user = new User(req.body);
            await user.save();
            res.status(201).send({ message: 'User created!', userId: user._id });
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static checkEmail = async (req, res, next) => {
        try {
            const id = req.query['id'];
            const email = req.query['email'];
            if(id){
                const user = await User.findById(id);
                if(!user){
                    errorThrewer(401, 'User not found')
                }
                return res.status(200).send(user);
            }
            else if (email) {
                const user = await User.findOne({email: email});
                if(!user){
                    return res.status(200).send(false);
                }
                return res.status(200).send(true);
            }
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

    static logIn = async(req, res, next)=>{
        try {
            const email = req.body.email;
            console.log(email);
            const password = req.body.password;
            console.log(password);
            const user = await User.findOne({email: email});
            if(!user){
                console.log(55);
                errorThrewer(401,'A user with this email could not be found.');
            }
            const isEqual = bcrypt.compare(password, user.password);
            if(!isEqual){
                errorThrewer(401,'Wrong password.');
            }
            const token = jwt.sign({
                id: user._id.toString(),
                email: user.email
            },
            process.env.JWTSECRET,
            {expiresIn: '12h'}
            );
            return res.status(200).send({ token: token, userId: user._id});
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }
}

module.exports = Auth;