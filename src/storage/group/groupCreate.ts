import { AppError } from '@utils/AppError';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";



export async function groupCreate(newGroup: string) {
    try {
        const storedGroups = await groupsGetAll(); 
        
        const groupAlreadyExist = storedGroups.includes(newGroup);
        if(groupAlreadyExist){
            throw new AppError(`Grupo ${newGroup} já existe.`);
        }
        const newGroups = [...storedGroups,newGroup];
        await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(newGroups));
    } catch (error) {
        throw error;

    }
}