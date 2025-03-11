// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import UserModel from "../models/user.model.js";
// import dotenv from "dotenv";

// dotenv.config();

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: "https://r0rvz7pf-3000.inc1.devtunnels.ms/api/auth/google/callback",
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 let user = await UserModel.findOne({ email: profile.emails[0].value });

//                 if (!user) {
//                     user = await UserModel.create({
//                         name: profile.displayName,
//                         email: profile.emails[0].value,
//                         password: "", // No password needed for Google login
//                         role: "Vendor", // Default role (change as needed)
//                         isActive: true,
//                     });
//                 }
//                 return done(null, user);
//             } catch (error) {
//                 return done(error, null);
//             }
//         }
//     )
// );

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await UserModel.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error, null);
//     }
// });

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.model.js";
import { createAccessToken, createRefreshToken } from "./jwtHelper.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://r0rvz7pf-3000.inc1.devtunnels.ms/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await UserModel.findOne({ email: profile.emails[0].value });

                if (!user) {
                    return done(null, false, { message: "You are not authorized." });
                }

                const response = {
                    accessToken: createAccessToken(user._id, user.role),
                    refreshToken: createRefreshToken(user._id, user.role),
                    email: user.email,
                    userId: user._id
                };

                return done(null, response); 
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
