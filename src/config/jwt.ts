import { sign, Secret, SignOptions, verify } from 'jsonwebtoken';
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

    static validateToken<T>(token: string): Promise<T | null> {

        return new Promise((resolve) => {
            verify(token, envs.JWT_SEED, (err, decoded) => {
                if (err || !decoded) return resolve(null);
                resolve(decoded as T);
            });
        });
    }
}