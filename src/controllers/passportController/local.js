import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "../../models/userModel";
import { transErrors, transSuccess } from "../../../lang/vi";

let localStrategy = passportLocal.Strategy;

/**
 *  Valid user local (Kiểm tra tài khoản user kiểu local)
 */

let initPassportLocal = () => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          let user = await UserModel.findByEmail(email);

          // If not found user
          if (!user) {
            return done(
              null,
              false,
              req.flash("errors", transErrors.login_failed)
            );
          }

          // If user is not actived
          if (!user.local.isActive) {
            return done(
              null,
              false,
              req.flash("errors", transErrors.account_not_active)
            );
          }

          const checkPassword = await user.comparePassword(password);
          if (!checkPassword) {
            return done(
              null,
              false,
              req.flash("errors", transErrors.login_failed)
            );
          }

          return done(
            null,
            user,
            req.flash("success", transSuccess.loginSuccess(user.username))
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

module.exports = initPassportLocal;
