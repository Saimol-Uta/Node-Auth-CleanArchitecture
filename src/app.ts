import { envs } from "./config";
import { Server } from "./presentation/server";


(() => {
    main();
})()

async function main() {
    // todo: wait base de datos

    new Server({
        port: envs.PORT
    }).start();
}