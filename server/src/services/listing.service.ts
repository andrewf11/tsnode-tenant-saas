import { Response } from 'express';
import { ListingRepository, UnitRepository, TenantRepository } from "../repositories";

export class ListingService {

    private listingRepository: ListingRepository;
    private unitRepository: UnitRepository;
    private tenantRepository: TenantRepository;

    constructor() {
        this.listingRepository = new ListingRepository();
        this.unitRepository = new UnitRepository();
        this.tenantRepository = new TenantRepository();
    }


    public async getListing(res: Response, id: number) {
        const listing = await this.listingRepository.findOne({where: {ListingId: id}, relations: ["Unit"]});
        if (listing) {
            return res.status(200).json(listing);
        }
    }


    public async getAllListings(res: Response, domain: string) {

        let query = { where: {}, relations: ["Unit"] };

        if(domain) {
            const tenantExists = await this.tenantRepository.getTenantByDomain(domain);

            if(!tenantExists) {
                return res.status(422).json({'errors': [{'msg': 'No Tenant found.'}]});
            }
            query.where = {TenantId: tenantExists.Id};
        }

        const listings = await this.listingRepository.find(query);

        if (!listings) {
            return res.status(422).json({'errors': [{'msg': 'No Listings found.'}]});
        }

        return res.status(200).json(listings);
    }



    public async getListedListings(res: Response, tenantId: number) {
        console.log('at service')
        const listings = await this.listingRepository.find({where: {TenantId: tenantId}, relations: ["Unit"]});
        const listedListings = listings.filter( listing => listing.Unit.IsListed);

        return res.status(200).json(listedListings);
    }


    public async getUnlistedListings(res: Response, tenantId: number) {
        const listings = await this.listingRepository.find({where: {TenantId: tenantId}, relations: ["Unit"]});
        const unlistedListings = listings.filter( listing => !listing.Unit.IsListed);
        return res.status(200).json(unlistedListings);
    }

    public async listListing(res: Response, id: number) {
        const listing = await this.listingRepository.findOne({where: {ListingId: id}, relations: ["Unit"]});

        if (!listing) {
            return res.status(422).json({'errors': [{'msg': 'Listing is not exists.'}]});
        }

        const unit = await this.unitRepository.findOne({UnitId: listing.Unit.UnitId});
        
        if (unit) {
            unit.IsListed = true;
            await this.unitRepository.update(unit.UnitId, unit);

            listing.ListedDate = new Date();
            listing.AvailableDate = new Date();
            listing.Unit = unit;
            await this.listingRepository.update(listing.ListingId, listing);

            console.log(listing)

            return res.status(200).json(listing);
        }
        
    }




    // public async updateListing(res: Response, id: number, name: string, stripeId: string, interval: string, amount: number) {
        
    //     var listing = await this.listingRepository.findOne(id);
    //     if(!listing) {
    //         return  res.status(422).json({'errors': [{'msg': 'Listing Id is invalid.'}]})
    //     }

    //     listing.MonthlyRent = monthlyRent;
    //     listing.Deposit = deposit;
    //     listing.Terms = terms;
    //     listing.AvailableDate = availableDate;
    //     listing.Section8
    //     listing.ListedDate
        
    //     var updatedListing = await this.listingRepository.update(id, listing);
    //     return res.status(200).json(updatedListing);
    // }

}
