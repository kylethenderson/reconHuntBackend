require('dotenv').config();

//ensure that all envs we need required to run are present
const requiredKeys = [
    'DATABASE_URL',
    'PORT',
];

const validate = (function validate() {
    for (key of requiredKeys) {
        if (!process.env[key]) {
            console.log(new Error(`Must provide ${key} env var`));
            process.exit(1);
        }
    }
}());

module.exports = validate;
