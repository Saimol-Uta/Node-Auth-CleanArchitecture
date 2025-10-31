import mongoose from "mongoose";

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
    public async connect(option: Option): Promise<boolean> {
        // Si ya está conectado, retorna true sin reconectar
        if (MongoDatabase.isConnected) {
            console.log('MongoDB already connected (Singleton pattern)');
            return true;
        }

        const { dbName, mongoUrl } = option;
        try {
            await mongoose.connect(mongoUrl, {
                dbName: dbName
            });
            MongoDatabase.isConnected = true;
            console.log('MongoDB connected successfully (Singleton pattern)');
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