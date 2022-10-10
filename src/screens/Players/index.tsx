import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { HighLight } from "@components/HighLight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { Loading } from "@components/Loading";
import { PlayerCard } from "@components/PlayerCard";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { PlayerStorageDTO } from "@storage/player/playerStorageDTO";
import { AppError } from "@utils/AppError";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";


type RouteParams = {
    group: string;
}


export function Players() {
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
    const route = useRoute();
    const newPlayerNameInputRef = useRef<TextInput>(null);
    const { group } = route.params as RouteParams;
    const [newPlayerName, setNewPlayerName] = useState('');
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);

    async function handleAddPlayer() {
        try {
            if (newPlayerName.trim().length === 0) {
                return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa para adicionar.');
            }
            const newPlayer = {
                name: newPlayerName,
                team: team,
            }

            await playerAddByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur();
            fetchPlayersByTeam();
            setNewPlayerName('');
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possível adicionar');
            }
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        } catch (error) {
            Alert.alert('Remover pessoa', 'Não foi possível remover a pessoa selecionada.');
            console.log(error);

        }

    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups');
        } catch (error) {
            Alert.alert('Remover grupo', 'Não foi possível remover o grupo selecionada.');
            console.log(error);

        }
    }

    async function handleGroupRemove() {
        Alert.alert('Remover grupo', 'Deseja remover o grupo?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => groupRemove() }
            ])
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);
            const playersByTeam = await playerGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        } catch (error) {
            console.log(error);
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado');
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);


    return (
        <Container>
            <Header showBackButton />
            <HighLight
                title={group}
                subtitle="adicione a galera e separe os times"
            />
            <Form>
                <Input
                    placeholder="Nome da Pessoa"
                    autoCorrect={false}
                    onChangeText={setNewPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                    value={newPlayerName}
                    inputRef={newPlayerNameInputRef}
                />
                <ButtonIcon icon="add" onPress={handleAddPlayer} />
            </Form>
            <HeaderList >
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter title={item} isActive={item === team} onPress={() => setTeam(item)} />
                    )}
                    horizontal
                />

                <NumbersOfPlayers> {players.length} </NumbersOfPlayers>
            </HeaderList>

            {
                isLoading ? <Loading /> : (
                    <FlatList
                        data={players}
                        keyExtractor={item => item.name}
                        renderItem={({ item }) => (
                            <PlayerCard name={item.name} onRemove={() => handlePlayerRemove(item.name)} />
                        )}
                        ListEmptyComponent={() => (
                            <ListEmpty message="Não há pessoas nesse time ! " />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            { paddingBottom: 100 },
                            players.length === 0 && { flex: 1 }
                        ]}
                    />
                )

            }


            <Button
                title="Remover Turma"
                type="SECONDARY"
                onPress={handleGroupRemove}

            />
        </Container>
    )
}