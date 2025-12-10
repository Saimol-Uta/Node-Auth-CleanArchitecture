import { Request, Response } from "express";
import { AuthRepository, CustomError, RegisterUser, RegisterUserDto } from "../../domain";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dtos";
import { LoginUser } from "../../domain/use-cases/auth/login-user.use-case";
import { LoginSessionSingleton } from "../../domain/session/login-session.singleton";



export class AuthController {

    //inyeccion de dependencias es
    //una tecnica de diseño de software que permite separar
    //la creación de objetos de su uso, lo que facilita la
    //mantenibilidad y escalabilidad del código.
    constructor(

        private readonly authRepository: AuthRepository,

    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });

        }

        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }

    //explicacion: res es la respuesta que se le da al cliente y req es la peticion que hace el cliente
    registerUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if (error) {
            return res.status(400).json({ error });
        }

        new RegisterUser(this.authRepository)
            .execute(registerUserDto!)
            .then(data => res.json(data))
            .catch(error => this.handleError(error, res));
    }

    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.login(req.body);
        if (error) {
            return res.status(400).json({ error });
        }

        new LoginUser(this.authRepository)
            .execute(loginUserDto!)
            .then(data => {
                // Guardar la sesión del usuario en el Singleton
                const sessionSingleton = LoginSessionSingleton.getInstance();
                // Extraer solo la información necesaria (sin password)
                const sessionUser = {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email
                };
                sessionSingleton.login(sessionUser, data.token);

                console.log(`✅ User session created for: ${data.user.email}`);
                console.log(`📊 Session stats:`, sessionSingleton.getSessionStats());

                return res.json(data);
            })
            .catch(error => this.handleError(error, res));
    }

    getUsers = (req: Request, res: Response) => {
        // Verificar si hay una sesión activa usando el Singleton
        const sessionSingleton = LoginSessionSingleton.getInstance();

        if (!sessionSingleton.isLoggedIn()) {
            return res.status(401).json({
                error: 'No active session found. Please login first.'
            });
        }

        // Obtener información del usuario de la sesión
        const currentUser = sessionSingleton.getCurrentUser();
        const sessionInfo = sessionSingleton.getSessionInfo();

        UserModel.find()
            .then(users => res.json({
                users: users,
                session: {
                    currentUser: {
                        id: currentUser?.id,
                        name: currentUser?.name,
                        email: currentUser?.email
                    },
                    sessionDuration: `${sessionSingleton.getSessionDuration()} minutes`,
                    sessionId: sessionInfo.sessionId,
                    loginTime: sessionInfo.loginTime
                }
            }))
            .catch(() => res.status(500).json({ error: 'Internal Server Error' }));
    }

    // Nuevo endpoint para cerrar sesión
    logoutUser = (req: Request, res: Response) => {
        const sessionSingleton = LoginSessionSingleton.getInstance();

        if (!sessionSingleton.isLoggedIn()) {
            return res.status(400).json({
                error: 'No active session to logout'
            });
        }

        const userEmail = sessionSingleton.getUserEmail();
        sessionSingleton.logout();

        return res.json({
            message: `User ${userEmail} logged out successfully`,
            timestamp: new Date().toISOString()
        });
    }

    // Nuevo endpoint para obtener información de la sesión actual
    getSessionInfo = (req: Request, res: Response) => {
        const sessionSingleton = LoginSessionSingleton.getInstance();

        if (!sessionSingleton.isLoggedIn()) {
            return res.status(401).json({
                error: 'No active session found'
            });
        }

        const stats = sessionSingleton.getSessionStats();
        const currentUser = sessionSingleton.getCurrentUser();

        return res.json({
            session: {
                user: {
                    id: currentUser?.id,
                    name: currentUser?.name,
                    email: currentUser?.email
                },
                stats: stats,
                token: sessionSingleton.getToken() ? '***' : null // Ocultar el token por seguridad
            }
        });
    }

}