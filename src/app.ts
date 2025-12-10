import { envs } from "./config";
import { DatabaseConfigSingleton } from "./config/database-config.singleton";
import { MongoDatabase } from "./data/mongodb";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";


(() => {
    main();
})()

async function main() {
    console.log('🚀 Starting application...\n');

    // 1. Inicializar el Singleton de configuración de bases de datos
    const dbConfigSingleton = DatabaseConfigSingleton.getInstance();
    console.log('📋 Database configurations loaded\n');

    // Validar configuraciones
    const validation = dbConfigSingleton.validateConnections();
    if (!validation.valid) {
        console.warn('⚠️ Configuration warnings:', validation.errors);
    }

    // 2. Conexión a MongoDB usando el Singleton de configuración
    const mongoInstance = MongoDatabase.getInstance();
    await mongoInstance.connect(); // Ahora usa automáticamente el DatabaseConfigSingleton

    // 3. PostgreSQL ya usa Singleton a través de la importación de prisma
    console.log('✅ All database connections established\n');

    // 4. Iniciar el servidor
    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    }).start();
}