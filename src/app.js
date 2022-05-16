import express from "express";
import path from "path";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import util from "util";
import "dotenv/config";

// Import Files
import "./connection/connection";
import router from "./routes/index.routes";
import multerConfig from "./multer.config";

const app = express();

// Configuracion de express (archivos estaticos, etc...)

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(router);

// Google Authentication with passport.js config from official documentation
/* passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: [ 'profile' ]
  }, function verify(issuer, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      issuer,
      profile.id
    ], function(err, row) {
      if (err) { return cb(err); }
      if (!row) {
        db.run('INSERT INTO users (name) VALUES (?)', [
          profile.displayName
        ], function(err) {
          if (err) { return cb(err); }
  
          var id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            issuer,
            profile.id
          ], function(err) {
            if (err) { return cb(err); }
            var user = {
              id: id,
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
          if (err) { return cb(err); }
          if (!row) { return cb(null, false); }
          return cb(null, row);
        });
      }
    });
})); */

// multer config to upload files to mongodb from official documentation

let storage = new GridFsStorage({
    url: `${process.env.FORRAJE_HOST}` + `${process.env.FORRAJE_DATABASE}`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      const match = ["image/png", "image/jpeg"];
      if (match.indexOf(file.mimetype) === -1) {
        const filename = `${Date.now()}-bezkoder-${file.originalname}`;
        return filename;
      }
      return {
        bucketName: dbConfig.imgBucket,
        filename: `${Date.now()}-bezkoder-${file.originalname}`
      };
    }
  });
  let uploadFiles = multer({ storage: storage }).single("file");
  let uploadFilesMiddleware = util.promisify(uploadFiles);
  module.exports = uploadFilesMiddleware;

// Configuracion del gestor de plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views/pages");

export default app;