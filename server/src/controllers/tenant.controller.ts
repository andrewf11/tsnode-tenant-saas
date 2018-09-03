import { Request, Response } from 'express';
import { BaseController } from './base-controller';
import { UserRepository } from '../repositories/user.repository';
import { TenantService } from '../services/Tenant.service';
import { validationResult } from 'express-validator/check';

export class TenantController extends BaseController {

    private tenantService: TenantService;
    private userRepository: UserRepository;

    constructor() {
        super();
        this.tenantService = new TenantService();
        //this.tenantRepository = new TenantRepository();
    }


    public async getTenants(req: Request, res: Response){
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const tenants = await this.tenantService.getTenants()
        console.log(tenants)
        if (tenants) {
            return res.status(200).json({Tenants: tenants});
        }
    }


    public async getTenantById(req: Request, res: Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const tenant = await this.tenantService.getTenantById(req.params.id);
        console.log(tenant);

        if(tenant)
            return res.status(200).json({Tenant: tenant});
    }


    public async getTenantUsers(req: Request, res: Response){
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const tenantUsers = await this.tenantService.getTenantUsers(id)
        console.log(tenantUsers)
        if (tenantUsers) {
            return res.status(200).json({Users: tenantUsers});
        }
    }


    public async updateTenant(req: Request, res: Response) {
        const errors = validationResult(req);
        const viewModel = req.body;

        console.log(viewModel.Id, viewModel.Domain, viewModel.Description, viewModel.Name, viewModel.Active, viewModel.Plan.Id);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        return await this.tenantService.updateTenant(res, viewModel.Id, viewModel.Domain, viewModel.Description, viewModel.Name, viewModel.Active, viewModel.Plan.Id);
    }
}
