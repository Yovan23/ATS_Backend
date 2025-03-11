
import express from "express";
import passport from "passport";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { login } from "../controller/auth.js";

const authRouter = express.Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// authRouter.get(
//     "/google/callback",
//     passport.authenticate("google", { failureRedirect: "https://r0rvz7pf-3000.inc1.devtunnels.ms/api/auth/google", session: false }),
//     (req, res) => {
//         if (!req.user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }
//         return res.status(200).json({
//             message: "User login successfully",
//             data: req.user,  
//         });
//     }
// );

authRouter.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({ message: "You are not authorized to login" });
            }
            console.log("api call/ callback");
            // res.redirect("/home")
            return res.status(200).json({
                message: "User login successfully",
                data: user,
            });
        })(req, res, next);
    }
);



authRouter.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.redirect("/");
    });
});

// Get logged-in user data
authRouter.get("/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

authRouter.post("/login", login);

export default authRouter;
