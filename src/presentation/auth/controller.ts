import { Request, Response } from "express";
import { AuthRepository, CustomError, RegisterUser, RegisterUserDto } from "../../domain";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dtos";
import { LoginUser } from "../../domain/use-cases/auth/login-user.use-case";



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
            .then(data => res.json(data))
            .catch(error => this.handleError(error, res));
    }

    getUsers = (req: Request, res: Response) => {
        UserModel.find()
            .then(users => res.json({
                //users,
                user: req.body.user
            }))
            .catch(() => res.status(500).json({ error: 'Internal Server Error' }));
    }

}