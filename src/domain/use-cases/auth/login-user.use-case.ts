import { SignOptions } from "jsonwebtoken";
import { RegisterUserDto } from "../../dtos/auth/register-user.dtos";
import { AuthRepository } from "../../repositories/auth.repository";
import { JwtAdapter } from "../../../config";
import { CustomError } from "../../errors/custom.error";
import { LoginUserDto } from "../../dtos/auth/login-user.dtos";

interface UserToken {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}

type SignToken = (payload: object, duration?: SignOptions["expiresIn"]) => Promise<string | null>

interface LoginUserUseCase {
    execute(loginUserDto: LoginUserDto): Promise<UserToken>;
}

export class LoginUser implements LoginUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly sigToken: SignToken = JwtAdapter.generateToken,
    ) { }

    async execute(loginUserDto: LoginUserDto): Promise<UserToken> {

        const user = await this.authRepository.login(loginUserDto);

        const token = await this.sigToken({ id: user.id }, '2h')

        if (!token) throw CustomError.internalServer('Error generating token');



        return {
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }

}