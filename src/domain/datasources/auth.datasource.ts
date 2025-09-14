import { LoginUserDto } from "../dtos/auth/login-user.dtos";
import { RegisterUserDto } from "../dtos/auth/register-user.dtos";
import { UserEntity } from "../entities/user.entity";


export abstract class AuthDatasource {

    abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
    abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;

}