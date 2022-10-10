import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { PLAYER_COLLECTION } from '@storage/storageConfig';
import { AppError } from '@utils/AppError';
import { playersGetAllGroups } from './playersGetByGroup';
import { PlayerStorageDTO } from "./playerStorageDTO";


export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string){
    try {
        const players = await playersGetAllGroups(group);
        const playerAlreadyExist = players.filter(player => player.name === newPlayer.name);
        if (playerAlreadyExist.length > 0){
            throw new AppError("Essa pessoa já está adicionada em um time aqui");
        }
        const storage = JSON.stringify([...players,newPlayer]);
        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
    }catch(error) {
        throw error;
    }
}       