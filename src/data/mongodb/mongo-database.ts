import mongoose from "mongoose";
import { DatabaseConfigSingleton } from "../../config/database-config.singleton";

interface Option {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {
    // Instancia única del Singleton
    private static instance: MongoDatabase | null = null;
    private static isConnected: boolean = false;

    // Constructor privado para evitar instanciación directa
    private constructor() { }

    // Método público para obtener la instancia única
    public static getInstance(): MongoDatabase {
        if (!MongoDatabase.instance) {
            MongoDatabase.instance = new MongoDatabase();
        }
        return MongoDatabase.instance;
    }

    // Método de conexión mejorado con Singleton
    public async connect(option?: Option): Promise<boolean> {
        // Si ya está conectado, retorna true sin reconectar
        if (MongoDatabase.isConnected) {
            console.log('MongoDB already connected (Singleton pattern)');
            return true;
        }

        // Usar el Singleton de configuración de base de datos si no se pasan opciones
        let dbName: string;
        let mongoUrl: string;

        if (option) {
            dbName = option.dbName;
            mongoUrl = option.mongoUrl;
        } else {
            // Obtener la configuración desde el DatabaseConfigSingleton
            const dbConfig = DatabaseConfigSingleton.getInstance();
            const mongoConfig = dbConfig.getMongoDBConnection();
            mongoUrl = mongoConfig.url;
            dbName = mongoConfig.dbName || 'authDB';
            console.log('📦 Using DatabaseConfigSingleton for MongoDB connection');
        }

        try {
            await mongoose.connect(mongoUrl, {
                dbName: dbName
            });
            MongoDatabase.isConnected = true;
            console.log('MongoDB connected successfully (Singleton pattern)');
            console.log(`📊 Database: ${dbName}`);
            return true;

        } catch (error) {
            console.log('MongoDB connection error:', error);
            throw error;
        }
    }

    // Método para desconectar (útil para testing)
    public async disconnect(): Promise<void> {
        if (MongoDatabase.isConnected) {
            await mongoose.disconnect();
            MongoDatabase.isConnected = false;
            console.log('MongoDB disconnected');
        }
    }

    // Método para verificar el estado de la conexión
    public isConnectionActive(): boolean {
        return MongoDatabase.isConnected;
    }

}