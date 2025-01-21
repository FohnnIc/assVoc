import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./auth/auth.route";
import messageRoutes from './routes/message.route';
import swaggerUi, {swaggerSpec} from "./swagger";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

mongoose.connect(process.env.MONGO_URI || "")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

export default app;
