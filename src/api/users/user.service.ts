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

async function updateUserInfo(id : number , name : string){
    try{
        const newUser = await prisma.user.update({
            where : {
                id : id
            }
            ,
            data : {
                name : name
            }
        })
        
        return newUser;
    }
    catch(error){
        console.error("Something went wrong while updating the user Info", error);
        throw new Error("Something went wrong while updating the user Info")
    }
}
export {getUserInfo , updateUserInfo};