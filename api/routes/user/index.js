// import functions
const login = require('./login');
const logout = require('./logout');
const register = require('./register');
const resetPassword = require('./resetPassword');
const refreshToken = require('./refreshToken');
const updateSettings = require('./updateSettings');
const contact = require('./contact')

module.exports = {
    login,
    logout,
    register,
    resetPassword,
    refreshToken,
    updateSettings,
    contact
};