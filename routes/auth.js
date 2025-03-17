
import express from "express";
import passport from "passport";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { login } from "../controller/auth.js";

const authRouter = express.Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.post(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({ message: "You are not authorized to login" });
            }
            console.log("api call/ callback");
            return res.success(200, "User login successfully", user);  
        });
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
