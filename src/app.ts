import { envs } from "./config";
import { MongoDatabase } from "./data/mongodb";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";


(() => {
    main();
})()

async function main() {
    // Conexión a base de datos usando el patrón Singleton

    // MongoDB Singleton
    const mongoInstance = MongoDatabase.getInstance();
    await mongoInstance.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL,
    });

    // PostgreSQL ya usa Singleton a través de la importación de prisma

    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    }).start();
}