import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDatasource, CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImple implements AuthDatasource {

    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction = BcryptAdapter.compare
    ) { }

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const { name, email, password } = registerUserDto;

        try {

            // 1. verificar si el correo existe

            const existEmail = await UserModel.findOne({ email });

            if (existEmail) throw CustomError.badRequest('Email already exists');


            //2. encriptar la contrasena
            const user = await UserModel.create({
                name: name,
                email: email,
                password: this.hashPassword(password),

            });

            await user.save();

            //3. mapear la respuesta a nuestra entidad

            // Todo: falta un mapper, un mapper es una funcion que mapea un objeto a otro objeto

            // cuando decimos recivir como dependencia
            //nos referimos a que la funcion se pasa como parametro al constructor
            // o al metodo de la clase y no se crea dentro de la clase
            // esto es para que la clase no dependa de una implementacion especifica
            // y se pueda cambiar la implementacion sin afectar la clase
            return UserMapper.userEntityFromObject(user);

        } catch (error) {
            //explicacion: si el error es una instancia de CustomError
            //entonces se lanza el error
            //si no, se lanza un error interno del servidor
            if (error instanceof CustomError) {
                throw error;
            }

            throw CustomError.internalServer();
        }
    }

}