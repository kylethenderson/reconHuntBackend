const multer = require('multer');
const { v1: uuidv1 } = require('uuid');

const fileFilter = (res, file, callback) => {

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Incorrect file type');
        error.code = 'MULTER_ERROR';
        return callback(error, false);
    }

    callback(null, true)
}
const MAX_SIZE = 3000000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'opt/frontend/public/images/')
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split('/')[1];
        cb(null, uuidv1() + `.${fileType}`)
    }
})

var upload = multer({ storage });

module.exports = upload;