import { AuthDatasource } from "../../domain";
import { AuthDatasourceImple } from "./auth.datasource.impl";
import { PostgresAuthDatasourceImpl } from "./postgres.auth.datasource.impl";



export class FactoryAuthDataSource {

    static async getDataSource(): Promise<AuthDatasource> {
        const dbClient = process.env.DB_CLIENT || 'mongodb';

        if (dbClient === 'mongodb') {

            return new AuthDatasourceImple();
        } else if (dbClient === 'postgresql') {
            return new PostgresAuthDatasourceImpl();
        } else {
            throw new Error(`Unsupported DB_CLIENT: ${dbClient}`);
        }
    }

}