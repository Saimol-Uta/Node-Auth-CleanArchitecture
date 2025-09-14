import { Request, Response } from "express";
import { AuthRepository, RegisterUserDto } from "../../domain";



export class AuthController {

    //inyeccion de dependencias es
    //una tecnica de diseño de software que permite separar
    //la creación de objetos de su uso, lo que facilita la
    //mantenibilidad y escalabilidad del código.
    constructor(

        private readonly authRepository: AuthRepository,

    ) { }

    //explicacion: res es la respuesta que se le da al cliente y req es la peticion que hace el cliente
    registerUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if (error) {
            return res.status(400).json({ error });
        }

        this.authRepository.register(registerUserDto!).then(user => res.json(user))
            .catch(error => res.status(500).json(error))

    }

    loginUser = (req: Request, res: Response) => {
        res.json(req.body);
    }

}