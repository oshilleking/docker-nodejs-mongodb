const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const router = express.Router();
const path = require('path');
const auth = require('http-auth');

const Registration = mongoose.model('Registration');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', (req, res) => {
    res.render('form', { title: 'Registration Form' });
});

router.get('/registrations', basic.check((req, res) => {
    Registration.find()
        .then((registrations) => {
            res.render('index', { title: 'Listing Registrations', registrations });
        })
        .catch(() => {
            res.send('Sorry! Something went wrong.');
        });
}));

// router.post('/', (req, res) => {
//     console.log(req.body);
//     res.render('form', { title: 'Registration Form' });
// });

router.post('/', [
        check('name')
        .isLength({ min: 8 })
        .withMessage('Please enter a name'),
        check('email')
        .isLength({ min: 1 })
        .withMessage('Please enter an email'),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const registration = new Registration(req.body);
            registration.save()
                .then(() => res.send('Thank you for your registration!'))
                .catch((err) => {
                    console.log(err);
                    res.send('Sorry! Something went wrong.');
                })
        } else {
            res.render('form', {
                title: 'Registration Form',
                errors: errors.array(),
                data: req.body,
            });
        }
    });

module.exports = router;