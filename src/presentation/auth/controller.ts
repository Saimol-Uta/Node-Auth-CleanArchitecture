import { Request, Response } from "express";
import { AuthRepository, CustomError, RegisterUserDto } from "../../domain";
import { JwtAdapter } from "../../config";



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

        this.authRepository.register(registerUserDto!)
            .then(async user => {
                res.json({
                    user,
                    token: await JwtAdapter.generateToken({ email: user.email })
                })
            })
            .catch(error => this.handleError(error, res));

    }

    loginUser = (req: Request, res: Response) => {
        res.json(req.body);
    }

}