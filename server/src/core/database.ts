import { createConnection } from "typeorm";
import {
  Applicant,
  User,
  Tenant,
  Property,
  Company,
  Plan,
  Product,
  Unit,
  Listing,
  PropertyType,
  UnitImage,
  PropertyImage,
  UnitFeatures,
  PropertyFeatures
} from '../entity';

export class Database {
  //public static db: mysql.Connection

  public static async createConnection() {

    return createConnection({
        type: "mysql",
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        synchronize: true,
        entities: [
          Applicant,
          User,
          Tenant,
          Property,
          Company,
          Plan,
          Product,
          Unit,
          Listing,
          PropertyType,
          UnitImage,
          PropertyImage,
          UnitFeatures,
          PropertyFeatures
        ]
    });
  }
}
