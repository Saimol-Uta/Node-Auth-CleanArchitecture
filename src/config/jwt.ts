import { sign, Secret, SignOptions } from 'jsonwebtoken';
import { envs } from './env';


export class JwtAdapter {

    static async generateToken(
        payload: object,
        duration: SignOptions['expiresIn'] = '2h'
    ): Promise<string | null> {

        const secret: Secret = envs.JWT_SEED;

        return new Promise((resolve) => {
            sign(payload, secret, { expiresIn: duration }, (err, token) => {
                if (err || !token) return resolve(null);
                resolve(token);
            });
        });
    }
}