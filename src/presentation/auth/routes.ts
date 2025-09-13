import { Router } from "express";
import { AuthController } from "./controller";


export class AuthRoutes {

    static get routes(): Router {
        const router = Router();
        const controller = new AuthController();

        //a qui se definen las rutas
        //cuando se manda una serie de argumentos se puede oviar y solo manda por referencia la funcion
        router.post('/login', controller.loginUser);

        router.post('/register', controller.registerUser);

        return router;
    }

}