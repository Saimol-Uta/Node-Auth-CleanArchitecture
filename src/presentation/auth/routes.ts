import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasourceImple, AuthRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middleware/auth.middleware";


export class AuthRoutes {

    static get routes(): Router {
        const router = Router();

        const datasource = new AuthDatasourceImple();

        //a qui se crea la instancia del repositorio
        const authRepository = new AuthRepositoryImpl(datasource);

        // a qui se inyecta la dependencia
        const controller = new AuthController(authRepository);

        //a qui se definen las rutas
        //cuando se manda una serie de argumentos se puede oviar y solo manda por referencia la funcion
        router.post('/login', controller.loginUser);

        router.post('/register', controller.registerUser);

        router.get('/', AuthMiddleware.validJWT, controller.getUsers);

        return router;
    }

}