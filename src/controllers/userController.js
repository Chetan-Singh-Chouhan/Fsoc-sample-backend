const userModel = require('../models/userModel');
const validation = require("../validation/validation")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//========================================Create User==================================================================//
const createUser = async function (req, res) {
    try {
        let body = req.body;
        
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: 'please enter all required details to register a user' });
        let { name, email, phone, password } = req.body;
        if (!name) return res.status(400).send({ status: false, message: 'name is required, please enter fname to register a user' });
        if (!validation.validate(name)) return res.status(400).send({ status: false, message: "invalid name" })
        if (!email) return res.status(400).send({ status: false, message: 'email is required, please enter email to register a user' });
        if (!validation.validateEmail(email)) return res.status(400).send({ status: false, message: "invalid email address" })
        if (!password) return res.status(400).send({ status: false, message: 'password is required, please enter password to register a user' });
        if (!phone) return res.status(400).send({ status: false, message: 'phone number is required, please enter phone number to register a user' });
        //if (!validation.validatePhone(phone)) return res.status(400).send({ status: false, message: "invalid phone number" })
        // password hashing ----------------
        const saltRound = 5;
        bcrypt.hash(password, saltRound, function (err, hash) {
            body.password = hash;
        });
        // for unique email and phone -------------
        let user = {};
        user = await userModel.findOne({ email: email })
        if (user) return res.status(409).send({ status: false, message: 'email already in use, please enter a unique email to register a user' });
        user = await userModel.findOne({ phone: phone });
        if (user) return res.status(409).send({ status: false, message: 'phone number is already in use, please enter a unique phone number to register a user' });
        const userCreated = await userModel.create(body);
        res.status(201).send({ status: true, message: 'User created successfully', data: userCreated });

    } 
    catch(error) {
        res.status(500).send({ status: false, message: error.message });
    }
};
//===================================================Login User========================================================//
const userLogin = async function (req, res) {
    try {
        const body = req.body;
        const { email, password } = body;
        if (!email) return res.status(400).send({ status: false, message: 'email is required, please enter email to login a user' });
        if (!password) return res.status(400).send({ status: false, message: 'password is required, please enter password to login a user' });
        const user = await userModel.findOne({ email: email });
        if (!user) return res.status(400).send({ status: false, message: 'email is incorrect' });

        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let payload = { userId: user._id, iat: Date.now() }
                let token = jwt.sign(payload, "secretKey")
                let decodedToken = jwt.verify(token, "secretKey");
                let userId = decodedToken.userId
                res.status(200).send({ status: true, message: 'user logged in successfully', data: { userId: userId, token: token } })
            }
            else { return res.status(400).send({ status: false, message: 'password is incorrect' }) }
        })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};

module.exports = { createUser, userLogin };