import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import {prisma} from '../../utils/prisma';


const saltRounds = 10;
async function createUser(name :  string, email : string, password : string){
    const hashedPass = await bcrypt.hash(password , saltRounds);
    const user = prisma.user.create({
        data : {
            name : name , 
            email : email , 
            password : hashedPass
        }
    })
    return user;
}
function findUser(){}
