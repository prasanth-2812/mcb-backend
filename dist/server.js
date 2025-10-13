"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const models_1 = require("./models");
const seed_1 = require("./utils/seed");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
async function start() {
    try {
        // Test database connection
        await (0, models_1.testConnection)();
        // Sync database schema
        await models_1.sequelize.sync({ alter: true });
        console.log('✅ Database schema synchronized');
        // Load seed data in non-production environments
        if (process.env.NODE_ENV !== 'production') {
            await (0, seed_1.runSeed)();
        }
        // Start the server
        app_1.default.listen(PORT, () => {
            console.log(`🚀 API server listening on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🗄️  Database: MySQL`);
        });
    }
    catch (err) {
        console.error('❌ Failed to start server', err);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map