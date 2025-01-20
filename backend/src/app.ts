import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./auth/auth.route";
import messageRoutes from './routes/message.route';
import swaggerUi, {swaggerSpec} from "./swagger";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/context", messageRoutes);

mongoose.connect(process.env.MONGO_URI || "")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

export default app;
