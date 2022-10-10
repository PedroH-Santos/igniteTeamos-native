import { Button } from "@components/Button";
import { GroupCard } from "@components/GroupCard";
import { Header } from "@components/Header";
import { HighLight } from "@components/HighLight";
import { ListEmpty } from "@components/ListEmpty";
import { Loading } from "@components/Loading";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { groupsGetAll } from "@storage/group/groupsGetAll";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Container } from "./styles";


export function Groups() {
    const [groups, setGroups] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();

    function handleNewGroup() {
        navigation.navigate('new');
    }


    async function fetchGroups() {
        try {
            setIsLoading(true);
            const data = await groupsGetAll();
            setGroups(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }


    function handleOpenGroup(group: string) {
        navigation.navigate('players', { group });

    }

    useFocusEffect(useCallback(() => {
        fetchGroups();
    }, []))
    return (
        <Container>
            <Header />
            <HighLight
                title="Turmas"
                subtitle="Jogue com a sua turma" />
            {isLoading ? <Loading /> : (
                <FlatList
                    data={groups}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <GroupCard
                            title={item}
                            onPress={() => { handleOpenGroup(item) }}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty message="Que tal cadastrar a primeira turma?" />
                    )}
                    contentContainerStyle={groups.length == 0 && { flex: 1 }}
                    showsVerticalScrollIndicator={false}
                />
            )



            }

            <Button title="Criar nova turma"
                onPress={handleNewGroup}
            />
        </Container>
    )
}



