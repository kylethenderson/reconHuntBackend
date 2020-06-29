const multer = require('multer');

const fileFilter = (res, file, callback) => {

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Incorrect file type');
        error.code = 'MULTER_ERROR';
        return callback(error, false);
    }

    callback(null, true)
}
const MAX_SIZE = 200000

const upload = multer({
    dest: './public/images',
    fileFilter,
    limits: {
        fileSize: MAX_SIZE
    }
})

module.exports = upload;