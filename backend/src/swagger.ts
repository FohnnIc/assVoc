import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Voice Assistant API",
            version: "1.0.0",
            description: "API documentation for the voice assistant project",
        },
        servers: [
            {
                url: "http://localhost:6000",
            },
        ],
    },
    apis: ["./src/auth/auth.route.ts"],
};

export const swaggerSpec = swaggerJsDoc(options);

export default swaggerUi;
