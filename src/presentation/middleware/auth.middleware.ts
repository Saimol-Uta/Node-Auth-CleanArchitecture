import { NextFunction, Request, Response } from "express";



export class AuthMiddleware {

    static validJWT = (req: Request, res: Response, nex: NextFunction) => {

        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'No token provided' });
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid bearer token' });

        const token = authorization.split(' ').at(1) || '';

        try {
            //el req.body.token se usa para pasar el token al controlador
            //de esta manera se evita que se pierdan los demas datos que se envian en el body
            //y solo se agrega el token al body
            //
            req.body.token = token;

            //a qui se usa el req.body = { token } para evitar que se modifique el objeto req.body
            //de esta manera se evita que se pierdan los demas datos que se envian en el body
            //y solo se agrega el token al body
            req.body = { token };

            // req.body = {token} vs req.body.token = token
            // la diferencia es que el primero crea un nuevo objeto req.body
            // y el segundo modifica el objeto req.body existente
            // en este caso se usa el segundo para evitar que se pierdan los demas datos que se envian en el body
            //el req.body.token = token ya no se puede usar porque da error porque req.body es de solo lectura
            //por eso se usa req.body = { token } que crea un nuevo objeto req.body
            nex();

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}