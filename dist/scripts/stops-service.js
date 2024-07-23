#!/usr/bin/env node
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const composePath = path.resolve(__dirname, "../../docker-compose.yml");
console.log("Stopping services...");
try {
    execSync(`docker-compose -f ${composePath} down`, { stdio: "inherit" });
    console.log("Services stopped successfully.");
}
catch (error) {
    console.error("Failed to stop services:", error);
    process.exit(1);
}
//# sourceMappingURL=stops-service.js.map