import homeController from "./homeController";
import authController from "./authController";
import userController from "./userController";

export const home = homeController;
export const auth = authController;
export const user = userController;
// export const verify = verifyController;

// tương tự với module.exports = { home: homeController, auth: authController }
