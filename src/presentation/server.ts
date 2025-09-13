import express, { Router } from 'express';


interface Options {
    port?: number;
    routes: Router;
}

//explicacion de dependencia explicita: Dependencia que se inyecta a traves del constructor
//explicacion de dependencia implicita: Dependencia que se crea dentro de la clase
//explicacion de inyeccion de dependencias: Patron de diseño que consiste en pasar las dependencias de una clase a través del constructor o métodos, en lugar de crear las dependencias dentro de la clase misma. Esto facilita la prueba y el mantenimiento del código, ya que las dependencias pueden ser fácilmente reemplazadas o modificadas sin cambiar la clase que las utiliza.

export class Server {

    // explicacion: readonly es para que no se pueda modificar despues de la inicializacion
    public readonly app = express();
    private readonly port: number;
    private readonly routes: Router;

    constructor(optinos: Options) {
        const { port = 3100, routes } = optinos;
        this.port = port;
        this.routes = routes;
    }

    async start() {

        //middleware para parsear el body de las peticiones
        this.app.use(express.json());

        this.app.use(express.urlencoded({ extended: true }));


        //usar las rutas definidas
        this.app.use(this.routes);

        //iniciar el servidor en el puerto definido
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });

    }
}


