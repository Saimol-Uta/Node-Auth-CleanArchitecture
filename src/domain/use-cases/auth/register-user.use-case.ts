import { SignOptions } from "jsonwebtoken";
import { RegisterUserDto } from "../../dtos/auth/register-user.dtos";
import { AuthRepository } from "../../repositories/auth.repository";
import { JwtAdapter } from "../../../config";
import { CustomError } from "../../errors/custom.error";

interface UserToken {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}

type SignToken = (payload: object, duration?: SignOptions["expiresIn"]) => Promise<string | null>

interface RegisterUserUseCase {
    execute(registerUserDto: RegisterUserDto): Promise<any>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly sigToken: SignToken = JwtAdapter.generateToken,
    ) { }

    async execute(registerUserDto: RegisterUserDto): Promise<any> {

        const user = await this.authRepository.register(registerUserDto);

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