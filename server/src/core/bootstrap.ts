import * as express from 'express';
import * as http from 'http';
import cors from 'cors';
import { Database } from '../core/database'
import { Server } from './server';
import { Seeds } from './seeds';
import { Storage } from './storage';
import { Authentication } from './middleware/authentication'
import { 
    UserRoutes,
    CompanyRoutes,
    TenantRoutes,
    PlanRoutes,
    PropertyRoutes,
    UnitRoutes,
    ListingRoutes,
    UnitImageRoutes,
    PropertyImageRoutes,
    UnitFeaturesRoutes,
    PropertyFeaturesRoutes,
    ApplicantRoutes
} from '../routes';

import * as dotenv from 'dotenv';

const root = './';

export class Bootstrap {

    public defineExpressApp(app: express.Application) {
        app.set('port', process.env.PORT || Server.normalizePort(3000));
    }

    public startServer(app: express.Application): http.Server {
        return app.listen(app.get('port'));
    }

    public setupEnviroment(app: express.Application): void {
        console.log('Setting up enviroment variables...');
        dotenv.config({ path: "./src/config/.env.development" });
    }

    public setupDatabase(app: express.Application): void {
        // Retrieve all queries
        // TODO: not sure if .then is wrong because queries is empty until then (should be await)
        console.log('Setting up database connection...')
        console.log(process.env.STRIPE_SKEY)
        Database.createConnection().then(async connection => {
            console.log('Connected to DB');
            console.log('Seeding database...');
            // Seeds.seedUsers();
            Seeds.seedPlans();
            Seeds.seedPropertyTypes();
        });
    }

    public setupCors(app: express.Application): void {
        console.log("Setting up CORS...")
        // app.use((req, res, next) => {
        //     res.header('Access-Control-Allow-Origin', 'http://localhost:8081' );
        //     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
        //     res.header('Access-Control-Allow-Credentials', 'true');
        //     next();
        // });
        app.use(cors());
    }

    public setupStorage(app: express.Application): void {
        console.log("Setting up local storage...")
        // Maybe I do something here?
        app.use(express.static('./public'))

        console.log("Setting up AWS storage...")
        // Maybe I do something here?
        const s = new Storage()
    }

    public setupAuthentication(app: express.Application): void {
        console.log("Setting up authentication...")
        app.use(Authentication.isAuthenticated);
    }

    public setupRoutes(app: express.Application): void {
     
        // serving api routes
        // const generalRouter = new GeneralRoutes().router;
        //const usersRouter = new UsersRoutes().router;
        console.log("Setting up routes...")
        const userRouter = new UserRoutes().router;
        app.use('/api', userRouter);

        const companyRouter = new CompanyRoutes().router;
        app.use('/api', companyRouter);

        const tenantRouter = new TenantRoutes().router;
        app.use('/api', tenantRouter);

        const planRouter = new PlanRoutes().router;
        app.use('/api', planRouter);

        const propertyRouter = new PropertyRoutes().router;
        app.use('/api', propertyRouter);

        const unitRouter = new UnitRoutes().router;
        app.use('/api', unitRouter);

        const listingRouter = new ListingRoutes().router;
        app.use('/api', listingRouter);

        const unitImageRouter = new UnitImageRoutes().router;
        app.use('/api', unitImageRouter);

        const propertyImageRoutes = new PropertyImageRoutes().router;
        app.use('/api', propertyImageRoutes);

        const propertyFeaturesRoutes = new PropertyFeaturesRoutes().router;
        app.use('/api', propertyFeaturesRoutes);

        const unitFeaturesRoutes = new UnitFeaturesRoutes().router;
        app.use('/api', unitFeaturesRoutes);

        const applicantRoutes = new ApplicantRoutes().router;
        app.use('/api', applicantRoutes);

    }
}
