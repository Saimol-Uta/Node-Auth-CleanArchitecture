import { PrismaClient } from '@prisma/client';

/**
 * Implementación del patrón Singleton para PrismaClient
 * Asegura que solo exista una instancia de PrismaClient en toda la aplicación
 */
class PrismaClientSingleton {
    private static instance: PrismaClient | null = null;

    // Constructor privado para prevenir instanciación directa
    private constructor() { }

    // Método público para obtener la instancia única
    public static getInstance(): PrismaClient {
        if (!PrismaClientSingleton.instance) {
            PrismaClientSingleton.instance = new PrismaClient({
                log: ['query', 'info', 'warn', 'error'],
            });
            console.log('PrismaClient instance created (Singleton pattern)');
        }
        return PrismaClientSingleton.instance;
    }

    // Método para desconectar (útil para testing y cierre de aplicación)
    public static async disconnect(): Promise<void> {
        if (PrismaClientSingleton.instance) {
            await PrismaClientSingleton.instance.$disconnect();
            console.log('PrismaClient disconnected');
            PrismaClientSingleton.instance = null;
        }
    }
}

// Exportar la instancia única de Prisma
const prisma = PrismaClientSingleton.getInstance();

export default prisma;
export { PrismaClientSingleton };