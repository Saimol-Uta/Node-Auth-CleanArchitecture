import mongoose from "mongoose";

interface Option {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {

    static async connect(option: Option) {

        const { dbName, mongoUrl } = option
        try {
            await mongoose.connect(mongoUrl, {
                dbName: dbName
            })
            console.log('mongo connected');
            return true;

        } catch (error) {
            console.log('mongo connection error')
            throw error;
        }

    }

}