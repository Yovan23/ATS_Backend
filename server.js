// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import logMessage, {
//     closeFileStreamForLogging,
//     openFileStreamForLogging,
// } from "./logs/log-config.js";
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";
// import connectDB from "./Database/dbConnect.js";
// import indexRouter from "./routes/indexRoutes.js";
// import { ErrorHandler, ErrorMiddleware } from "./middlewares/errorhandler.middleware.js";
// import { ResponseHandler } from "./middlewares/response.middleware.js";
// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const app = express();
// app.use(express.json());

// app.use(
//     cors({
//         origin: "*",
//         methods: ["GET", "POST", "PATCH", "DELETE"],
//         credentials: true,
//     })
// );
// app.get("/*", express.static(path.join(__dirname, "files")));
// app.use(express.static(path.join(__dirname, "public")));
// app.get("/test", (_, res) => {
//     logMessage("info", "first log");
//     res.status(200).json({
//         success: true,
//         message: "Jai Swaminarayan.",
//     });
// });

// app.use(ResponseHandler);
// app.use(indexRouter);
// app.use(ErrorMiddleware);
// const PORT = process.env.PORT || 8000;
// const server = app.listen(PORT, (error) => {
//     openFileStreamForLogging();
//     if (error) {
//         logMessage("ERROR", `Server didn't start : \n ${error}`);
//         return;
//     }
//     logMessage("info", `Server started on ${PORT}`);
// });

// connectDB();

// process.on("SIGINT", () => {
//     closeFileStreamForLogging();
//     server.closeAllConnections();
//     process.exit(0);
// });


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logMessage, {
    closeFileStreamForLogging,
    openFileStreamForLogging,
} from "./logs/log-config.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import connectDB from "./Database/dbConnect.js";
import indexRouter from "./routes/indexRoutes.js";
import { ErrorHandler, ErrorMiddleware } from "./middlewares/errorhandler.middleware.js";
import { ResponseHandler } from "./middlewares/response.middleware.js";
import passport from "passport";
import session from "express-session";
import "./utils/passportSetup.js"; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
        credentials: true,
    })
);

// Session middleware for passport
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secretKey",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set `secure: true` in production
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/*", express.static(path.join(__dirname, "files")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/test", (_, res) => {
    logMessage("info", "first log");
    res.status(200).json({
        success: true,
        message: "Jai Swaminarayan.",
    });
});

app.use(ResponseHandler);
app.use(indexRouter);
app.use(ErrorMiddleware);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, (error) => {
    openFileStreamForLogging();
    if (error) {
        logMessage("ERROR", `Server didn't start : \n ${error}`);
        return;
    }
    logMessage("info", `Server started on ${PORT}`);
});

connectDB();

process.on("SIGINT", () => {
    closeFileStreamForLogging();
    server.closeAllConnections();
    process.exit(0);
});
