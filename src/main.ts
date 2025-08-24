/* eslint-disable no-console */
import "./instrument.js";
import { ServicesApplication } from "./services-application.js";

async function bootstrap() {
    try {
        await ServicesApplication.bootstrap();
    } catch (error) {
        console.error("❌ Failed to start application:", error);
        process.exit(1);
    }
}


process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing application");
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("SIGINT signal received: closing application");
    process.exit(0);
});


bootstrap();
