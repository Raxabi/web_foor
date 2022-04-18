import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "../data");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname, + "-" + Date.now());
    }
});

export default multer({ storage });