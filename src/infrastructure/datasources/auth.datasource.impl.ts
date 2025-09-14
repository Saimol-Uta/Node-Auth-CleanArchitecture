import { AuthDatasource, CustomError, RegisterUserDto, UserEntity } from "../../domain";


export class AuthDatasourceImple implements AuthDatasource {

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const { name, email, password } = registerUserDto;

        try {

            // 1. verificar si el correo existe

            //2. encriptar la contrasena

            //3. mapear la respuesta a nuestra entidad

            return new UserEntity(
                '1',
                name,
                email,
                password,
                ['USER'],
                'no-image'
            );

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }

            throw CustomError.internalServer();
        }
    }

}