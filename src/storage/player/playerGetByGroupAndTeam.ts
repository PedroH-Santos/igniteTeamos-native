import { playersGetAllGroups } from "./playersGetByGroup";



export async function playerGetByGroupAndTeam(group: string, team: string) {
    try {
        const storage = await playersGetAllGroups(group);
        const players = storage.filter(player => player.team === team);
        return players;
    } catch (error) {
        throw error;
    }
}