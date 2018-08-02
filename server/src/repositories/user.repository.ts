import { Request, Response } from 'express';
import moment from 'moment';
import { EntityRepository, Repository, getRepository, MoreThan } from "typeorm";
import { getConnection } from "typeorm";
import { User } from "../entity/User";


@EntityRepository(User)
export class UserRepository extends Repository<User> {


    public async createUser(res: Response, username: string, email: string, passwordHash: string, emailVerifyToken: string){
        return await getConnection().manager.save(User, {Username: username, Email: email, PasswordHash: passwordHash, EmailVerifyToken: emailVerifyToken});
    }



    
    public async getUserByEmail(email: string){
        return await getConnection().manager.findOne(User, {Email: email});
    }




    public async getUserByToken(token: string){
        return await getRepository(User).findOne({EmailVerifyToken: token});
    }




    public async getUserByTokenAndExpiration(token: string){
        return await getConnection().manager.findOne(User, { where: {PasswordResetToken: token , PasswordResetExpires: MoreThan(Date.now())} });
    }




    public async forgotPassword(user: User){
        return await getRepository(User).save(user);
    }




    public async saveUser(res: Response, user: User){
        return await getConnection().manager.save(User, user);
    }
}