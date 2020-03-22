import passport from "passport";
import passportGoogle from "passport-google-oauth";
import UserModel from "../../models/userModel";
import { transErrors, transSuccess } from "../../../lang/vi";

let googleStrategy = passportGoogle.OAuth2Strategy;

let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;

/**
 *  Valid user facebook
 */

let initPassportGoogle = () => {
  passport.use(
    new googleStrategy(
      {
        clientID: ggAppId,
        clientSecret: ggAppSecret,
        callbackURL: ggCallbackUrl,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {

          let user = await UserModel.findByGoogleId(profile.id);

          // If found user
          if (user) {
            return done(
              null,
              user,
              req.flash("success", transSuccess.loginSuccess(user.username))
            );
          }

          let newUserItem = {
            username: profile.displayName,
            gender: profile.gender,
            local: { isActive: true },
            google: {
              email: profile.emails[0].value,
              uid: profile.id,
              token: accessToken
            }
          };
          let newUser = await UserModel.createNew(newUserItem);

          return done(
            null,
            newUser,
            req.flash("success", transSuccess.loginSuccess(newUser.username))
          );
        } catch (error) {
          console.log(error);
          return done(null, false, req.flash("errors"));
        }
      }
    )
  );

  // Save userId to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Được gọi bởi hàm passport.session()
  // sau đó sẽ truyền user info (khi đăng nhập thành công) vào biến req.user
  passport.deserializeUser(async (id, done) => {
    UserModel.findUserById(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      });
  });
};

module.exports = initPassportGoogle;
