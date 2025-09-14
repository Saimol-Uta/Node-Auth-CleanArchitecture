import { Validators } from "../../../config";




export class LoginUserDto {

    constructor(
        public email: string,
        public password: string,
    ) { }

    static login(object: { [key: string]: any } | undefined): [string | undefined, LoginUserDto?] {
        if (!object) return ['Missing body'];

        const { email, password } = object;

        if (!email) return ['Missing email'];
        if (!Validators.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];


        return [
            undefined,
            new LoginUserDto(email, password)
        ];
    }


}
