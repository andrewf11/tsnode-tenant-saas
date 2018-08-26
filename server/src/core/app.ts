import express from 'express';
import "reflect-metadata";
import { Bootstrap } from './bootstrap';
import { AppConfig } from './app-config';
import { Server } from './server';

export class App {

    private express: express.Application = express();
    private bootstrapApp = new Bootstrap();

    constructor() {
        // It also loads the .env file into the 'process.env' variable.
        // dotenv.config();
        // Create express app
        this.bootstrapApp.defineExpressApp(this.express);
    }

    public async bootstrap(): Promise<void> {
        // Configure the app config for all the middlewares
        const appConfig = new AppConfig();
        appConfig.configure(this.express);
        this.bootstrapApp.setupEnviroment(this.express);
        this.bootstrapApp.setupDatabase(this.express);
        this.bootstrapApp.setupCors(this.express);
        this.bootstrapApp.setupRoutes(this.express);
        this.bootstrapApp.setupStorage(this.express);

        const activeServer = this.bootstrapApp.startServer(this.express);
        const server = new Server(activeServer);
        server.use(this.express);
    }
}
