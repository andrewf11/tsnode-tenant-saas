
import { Response } from 'express';
import { UnitRepository, ListingRepository, PropertyRepository } from "../repositories";

export class UnitService {
   
    private unitRepository: UnitRepository;
    private listingRepository: ListingRepository;
    private propertyRepository: PropertyRepository;

    constructor() {
        this.unitRepository = new UnitRepository();
        this.listingRepository = new ListingRepository();
        this.propertyRepository = new PropertyRepository();
    }

    public async createPropertyUnit(res: Response, tenantId: number, propertyId: number, unitNumber: string, bedrooms: number, baths: number, sqFt: number, smoking: boolean, garage: boolean) {
      const propertyExists = await this.unitRepository.findOne({TenantId: tenantId, Property: propertyId, UnitNumber: unitNumber, Bedrooms: bedrooms, Baths: baths, SqFt: sqFt, Smoking: smoking, Garage: garage});
      
      if (propertyExists) {
          return res.status(422).json({'errors': [{'msg': 'Unit already exists.'}]});
      }
      
      const newUnit= await this.unitRepository.create({TenantId: tenantId, Bedrooms: bedrooms, Baths: baths, Property: propertyId, UnitNumber: unitNumber});
      
      const property = await this.propertyRepository.findOne({Id: propertyId});
      
      await this.listingRepository.create({TenantId: tenantId, Unit: newUnit, Property: property});

      return res.status(200).json(newUnit);
  }


  public async getPropertyUnits(res: Response, tenantId: number, propertyId: number) {

      const propertyUnits = await this.unitRepository.find({ TenantId: tenantId, Property: propertyId });

      return res.status(200).json({ Units: propertyUnits });
  }


  public async getPropertyUnit(res: Response, tenantId: number, propertyId: number, unitId: number) {

      const propertyUnit = await this.unitRepository.findOne({ where: { TenantId: tenantId, Property: propertyId, UnitId: unitId } });

      return res.status(200).json({ Unit: propertyUnit });
  }


  public async updatePropertyUnit(res: Response, tenantId: number, propertyId: number, unitId: number, unitNumber: string, bedrooms: number, baths: number, sqFt: number, smoking: boolean, garage: boolean) {
      const unit = await this.unitRepository.findOne({TenantId: tenantId, Property: propertyId, UnitId: unitId});
      
      if (!unit) {
          return res.status(422).json({'errors': [{'msg': 'Unit not found.'}]});
      }

      unit.UnitNumber = unitNumber;
      unit.Bedrooms = bedrooms;
      unit.Baths = baths;
      unit.SqFt= sqFt;
      unit.Smoking = smoking;
      unit.Garage = garage;

      await this.unitRepository.update(unitId, unit);

      return res.status(200).json({ Unit: unit });
  }


  public async deletePropertyUnit(res: Response, tenantId: number, propertyId: number, unitId: number) {

      const propertyUnit = await this.unitRepository.findOne({ where: { TenantId: tenantId, PropertyId: propertyId, UnitId: unitId } });

      if (!propertyUnit) {
          return res.status(422).json({'errors': [{'msg': 'Unit does not exist.'}]});
      }

      await this.unitRepository.delete(unitId);

      return res.status(200).json({'msg': 'Successfully removed property unit.'});
  }

}
