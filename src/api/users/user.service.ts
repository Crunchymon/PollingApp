import {prisma} from '../../utils/prisma';
async function getUserInfo(id : number){
    try{
        const user = await prisma.user.findUnique({
            where : {
                id : id
            }
        })
        
        return user;
    }
    catch(error){
        console.error("Something went wrong while getting the user Info", error);
        throw new Error("Something went wrong while getting the user Info")
    }
   
}
export {getUserInfo};