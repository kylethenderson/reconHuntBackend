const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserAuth = require('../../../models/auth');
const { TOKEN_SECRET } = process.env;
const { loginValidation } = require('../../../scripts/validations')

router.get('/', (req, res) => {
    res.status(200).json('login route')
})

router.post('/', async (req, res) => {
    const { body } = req;

    // validate req.body data
    const { error } = loginValidation.validate(body);
    if (error) return res.status(400).json({
        message: error.details[0].message,
    })

    // ensure user is in collection
    const user = await UserAuth.findOne({ username: body.username })
    if (!user) return res.status(400).json({
        message: 'User not found',
    });

    // validate password
    const validPass = await bcrypt.compare(body.password, user.password);
    if (!validPass) return res.status(400).json({
        message: 'Invalid password',
    });

    // prep data to be included in token
    // console.log(user);
    const tokenData = {
        id: user.uuid,
        username: user.username,
    }

    // create token
    const token = jwt.sign(tokenData, TOKEN_SECRET);

    res.header('auth-token', token).status(200).json('Login successful');

})

module.exports = router;