/**
 * SINGLETON para la sesión de login del usuario
 * 
 * Este patrón asegura que:
 * - Solo existe una única instancia de sesión activa
 * - Los datos del usuario autenticado se mantienen durante toda la sesión
 * - Proporciona un punto único de acceso a la información del usuario logueado
 * 
 * Ventajas:
 * - Gestión centralizada de la sesión del usuario
 * - Evita múltiples instancias de sesión
 * - Facilita el acceso a los datos del usuario en toda la aplicación
 * - Útil para mantener el estado de autenticación
 */

// Tipo para usuario en sesión (sin información sensible como password)
export interface SessionUser {
    id: string;
    name: string;
    email: string;
    role?: string[];
}

interface SessionData {
    user: SessionUser | null;
    token: string | null;
    loginTime: Date | null;
    lastActivity: Date | null;
    sessionId: string | null;
}

export class LoginSessionSingleton {
    // Única instancia del Singleton
    private static instance: LoginSessionSingleton | null = null;
    
    // Datos de la sesión actual
    private sessionData: SessionData;
    
    // Configuración de timeout de sesión (en milisegundos)
    private sessionTimeout: number = 30 * 60 * 1000; // 30 minutos por defecto

    /**
     * Constructor privado - Previene instanciación directa con 'new'
     * Solo se puede acceder a través de getInstance()
     */
    private constructor() {
        this.sessionData = {
            user: null,
            token: null,
            loginTime: null,
            lastActivity: null,
            sessionId: null
        };
        
        console.log('🔐 LoginSessionSingleton initialized');
    }

    /**
     * Método público estático para obtener la instancia única
     * Implementación Lazy (se crea solo cuando se necesita)
     */
    public static getInstance(): LoginSessionSingleton {
        if (!LoginSessionSingleton.instance) {
            LoginSessionSingleton.instance = new LoginSessionSingleton();
            console.log('✅ LoginSessionSingleton instance created (First time)');
        }
        return LoginSessionSingleton.instance;
    }

    /**
     * Iniciar sesión - Guardar usuario y credenciales
     */
    public login(user: SessionUser, token: string): void {
        const now = new Date();
        
        this.sessionData = {
            user: user,
            token: token,
            loginTime: now,
            lastActivity: now,
            sessionId: this.generateSessionId()
        };
        
        console.log(`👤 User ${user.name} logged in at ${now.toISOString()}`);
        console.log(`🎫 Session ID: ${this.sessionData.sessionId}`);
    }

    /**
     * Cerrar sesión - Limpiar datos del usuario
     */
    public logout(): void {
        const userName = this.sessionData.user?.name || 'Unknown';
        
        this.sessionData = {
            user: null,
            token: null,
            loginTime: null,
            lastActivity: null,
            sessionId: null
        };
        
        console.log(`👋 User ${userName} logged out`);
    }

    /**
     * Obtener el usuario actual logueado
     */
    public getCurrentUser(): SessionUser | null {
        this.updateLastActivity();
        return this.sessionData.user;
    }

    /**
     * Obtener el token de la sesión actual
     */
    public getToken(): string | null {
        this.updateLastActivity();
        return this.sessionData.token;
    }

    /**
     * Verificar si hay un usuario logueado
     */
    public isLoggedIn(): boolean {
        return this.sessionData.user !== null && this.sessionData.token !== null;
    }

    /**
     * Obtener información completa de la sesión
     */
    public getSessionInfo(): SessionData {
        this.updateLastActivity();
        return { ...this.sessionData }; // Retorna una copia para evitar mutaciones
    }

    /**
     * Obtener el email del usuario logueado (útil para validaciones rápidas)
     */
    public getUserEmail(): string | null {
        this.updateLastActivity();
        return this.sessionData.user?.email || null;
    }

    /**
     * Obtener el ID del usuario logueado
     */
    public getUserId(): string | null {
        this.updateLastActivity();
        return this.sessionData.user?.id || null;
    }

    /**
     * Obtener el nombre del usuario logueado
     */
    public getUserName(): string | null {
        this.updateLastActivity();
        return this.sessionData.user?.name || null;
    }

    /**
     * Actualizar el timestamp de última actividad
     */
    private updateLastActivity(): void {
        if (this.sessionData.user) {
            this.sessionData.lastActivity = new Date();
        }
    }

    /**
     * Generar un ID único de sesión
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Obtener duración de la sesión actual en minutos
     */
    public getSessionDuration(): number | null {
        if (!this.sessionData.loginTime) {
            return null;
        }
        
        const now = new Date();
        const duration = now.getTime() - this.sessionData.loginTime.getTime();
        return Math.floor(duration / 1000 / 60); // en minutos
    }

    /**
     * Verificar si la sesión ha expirado
     */
    public isSessionExpired(): boolean {
        if (!this.sessionData.lastActivity) {
            return true;
        }
        
        const now = new Date();
        const timeSinceLastActivity = now.getTime() - this.sessionData.lastActivity.getTime();
        
        return timeSinceLastActivity > this.sessionTimeout;
    }

    /**
     * Configurar el timeout de sesión (en minutos)
     */
    public setSessionTimeout(minutes: number): void {
        this.sessionTimeout = minutes * 60 * 1000;
        console.log(`⏱️ Session timeout set to ${minutes} minutes`);
    }

    /**
     * Renovar el token de la sesión actual
     */
    public renewToken(newToken: string): void {
        if (this.sessionData.user) {
            this.sessionData.token = newToken;
            this.updateLastActivity();
            console.log('🔄 Session token renewed');
        } else {
            console.warn('⚠️ Cannot renew token: No active session');
        }
    }

    /**
     * Actualizar información del usuario en la sesión
     */
    public updateUserInfo(updatedUser: Partial<SessionUser>): void {
        if (this.sessionData.user) {
            this.sessionData.user = {
                ...this.sessionData.user,
                ...updatedUser
            };
            this.updateLastActivity();
            console.log('✏️ User information updated in session');
        } else {
            console.warn('⚠️ Cannot update user info: No active session');
        }
    }

    /**
     * Resetear la instancia (útil principalmente para testing)
     * ⚠️ Usar con precaución en producción
     */
    public static resetInstance(): void {
        if (LoginSessionSingleton.instance) {
            LoginSessionSingleton.instance.logout();
        }
        LoginSessionSingleton.instance = null;
        console.log('⚠️ LoginSessionSingleton instance reset');
    }

    /**
     * Obtener estadísticas de la sesión
     */
    public getSessionStats(): {
        isActive: boolean;
        duration: number | null;
        isExpired: boolean;
        sessionId: string | null;
        lastActivity: Date | null;
    } {
        return {
            isActive: this.isLoggedIn(),
            duration: this.getSessionDuration(),
            isExpired: this.isSessionExpired(),
            sessionId: this.sessionData.sessionId,
            lastActivity: this.sessionData.lastActivity
        };
    }
}
