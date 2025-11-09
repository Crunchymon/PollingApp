import {prisma} from '../../utils/prisma';
async function getUserInfo(id : number){
    const user = await prisma.user.findUnique({
        where : {
            id : id
        }
    })
    
    return user;
}
export {getUserInfo};