import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ?? 7000;

process.on("SIGINT", () => {
    console.log("Process terminated. Cleaning up...");
    process.exit(0);
});

const server = app.listen(PORT, () => {
    console.log("------------------");
    console.log(`Server running on port ${PORT}`);
    console.log("  ");
    console.log("API Documentation:");
    console.log(`http://localhost:${PORT}/api-docs`);
    console.log("------------------");
});

server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
        process.exit(1);
    }
});