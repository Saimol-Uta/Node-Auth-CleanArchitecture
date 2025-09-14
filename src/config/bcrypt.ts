import { compareSync, hashSync } from 'bcryptjs';


// se usa patron adapter para implementar bcrypt
// y asi poder cambiar la libreria en el futuro sin afectar el codigo
// el adapter es una clase que implementa una interfaz
// y utiliza una libreria externa para cumplir con la interfaz
export class BcryptAdapter {
    static hash(password: string): string {
        return hashSync(password);
    }

    static compare(password: string, hashed: string): boolean {
        return compareSync(password, hashed);
    }


}
