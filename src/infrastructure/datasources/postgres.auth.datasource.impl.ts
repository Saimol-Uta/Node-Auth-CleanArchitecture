import { BcryptAdapter } from "../../config";
import prisma from "../../data/Postgres";
import { AuthDatasource, CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dtos";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class PostgresAuthDatasourceImpl implements AuthDatasource {

    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction = BcryptAdapter.compare
    ) { }
    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const { email, password } = loginUserDto;

        try {

            const existEmail = await prisma.user.findFirst({ where: { email } });
            if (!existEmail) throw CustomError.badRequest('Email not exist');

            const passwordCorrect = this.comparePassword(password, existEmail!.password);

            if (!passwordCorrect) throw CustomError.unauthorized('Password not correct');
            return UserMapper.userEntityFromObject(existEmail!);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }

            throw CustomError.internalServer();
        }

    }

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const { name, email, password } = registerUserDto;

        try {

            // 1. verificar si el correo existe

            const existEmail = await prisma.user.findFirst({ where: { email } });

            if (existEmail) throw CustomError.badRequest('Email already exists');


            //2. encriptar la contrasena
            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: this.hashPassword(password),
                }
            });



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