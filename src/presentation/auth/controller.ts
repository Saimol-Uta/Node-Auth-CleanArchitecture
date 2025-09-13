import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain";



export class AuthController {


    constructor() { }

    //explicacion: res es la respuesta que se le da al cliente y req es la peticion que hace el cliente
    registerUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if (error) {
            return res.status(400).json({ error });
        }


        res.json(registerUserDto);


    }

    loginUser = (req: Request, res: Response) => {
        res.json(req.body);
    }

}