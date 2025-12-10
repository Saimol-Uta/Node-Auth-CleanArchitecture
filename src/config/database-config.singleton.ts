/**
 * SINGLETON para la configuración de cadenas de conexión a bases de datos
 * 
 * Este patrón asegura que:
 * - Solo existe una única instancia de configuración de conexión
 * - Las credenciales se cargan una sola vez
 * - Proporciona acceso centralizado a las cadenas de conexión
 * 
 * Ventajas:
 * - Evita múltiples lecturas de variables de entorno
 * - Centraliza la configuración de bases de datos
 * - Facilita el cambio de configuración en tiempo de ejecución (si es necesario)
 */

interface DatabaseConnection {
    type: 'mongodb' | 'postgres';
    url: string;
    dbName?: string;
    options?: Record<string, any>;
}

interface DatabaseConfig {
    mongodb: DatabaseConnection;
    postgres: DatabaseConnection;
}

export class DatabaseConfigSingleton {
    // Única instancia del Singleton
    private static instance: DatabaseConfigSingleton | null = null;

    // Configuración privada de las conexiones
    private config: DatabaseConfig;

    // Timestamp de cuándo se inicializó
    private readonly initializedAt: Date;

    /**
     * Constructor privado - Previene instanciación directa con 'new'
     * Solo se puede acceder a través de getInstance()
     */
    private constructor() {
        this.initializedAt = new Date();

        // Cargar las cadenas de conexión desde variables de entorno
        this.config = {
            mongodb: {
                type: 'mongodb',
                url: process.env.MONGO_URL || 'mongodb://localhost:27017',
                dbName: process.env.MONGO_DB_NAME || 'authDB',
                options: {
                    retryWrites: true,
                    w: 'majority'
                }
            },
            postgres: {
                type: 'postgres',
                url: process.env.DATABASE_URL || 'postgresql://localhost:5432/authdb',
                options: {
                    // Opciones adicionales de Prisma si es necesario
                }
            }
        };

        console.log('🔧 DatabaseConfigSingleton initialized at:', this.initializedAt.toISOString());
    }

    /**
     * Método público estático para obtener la instancia única
     * Implementación Lazy (se crea solo cuando se necesita)
     */
    public static getInstance(): DatabaseConfigSingleton {
        if (!DatabaseConfigSingleton.instance) {
            DatabaseConfigSingleton.instance = new DatabaseConfigSingleton();
            console.log('✅ DatabaseConfigSingleton instance created (First time)');
        }
        return DatabaseConfigSingleton.instance;
    }

    /**
     * Obtener la cadena de conexión de MongoDB
     */
    public getMongoDBConnection(): DatabaseConnection {
        return { ...this.config.mongodb }; // Retorna una copia para evitar mutaciones
    }

    /**
     * Obtener la cadena de conexión de PostgreSQL
     */
    public getPostgresConnection(): DatabaseConnection {
        return { ...this.config.postgres }; // Retorna una copia para evitar mutaciones
    }

    /**
     * Obtener todas las configuraciones
     */
    public getAllConnections(): DatabaseConfig {
        return {
            mongodb: { ...this.config.mongodb },
            postgres: { ...this.config.postgres }
        };
    }

    /**
     * Actualizar la configuración de MongoDB (útil para testing o cambios dinámicos)
     */
    public updateMongoDBConnection(url: string, dbName?: string): void {
        this.config.mongodb.url = url;
        if (dbName) {
            this.config.mongodb.dbName = dbName;
        }
        console.log('🔄 MongoDB connection config updated');
    }

    /**
     * Actualizar la configuración de PostgreSQL
     */
    public updatePostgresConnection(url: string): void {
        this.config.postgres.url = url;
        console.log('🔄 PostgreSQL connection config updated');
    }

    /**
     * Obtener información sobre cuándo se inicializó el Singleton
     */
    public getInitializationInfo(): { initializedAt: Date; uptime: number } {
        const now = new Date();
        const uptime = now.getTime() - this.initializedAt.getTime();

        return {
            initializedAt: this.initializedAt,
            uptime: uptime // en milisegundos
        };
    }

    /**
     * Resetear la instancia (útil principalmente para testing)
     * ⚠️ Usar con precaución en producción
     */
    public static resetInstance(): void {
        DatabaseConfigSingleton.instance = null;
        console.log('⚠️ DatabaseConfigSingleton instance reset');
    }

    /**
     * Validar que las cadenas de conexión estén configuradas correctamente
     */
    public validateConnections(): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!this.config.mongodb.url || this.config.mongodb.url === 'mongodb://localhost:27017') {
            errors.push('MongoDB URL not configured or using default');
        }

        if (!this.config.postgres.url || this.config.postgres.url === 'postgresql://localhost:5432/authdb') {
            errors.push('PostgreSQL URL not configured or using default');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
