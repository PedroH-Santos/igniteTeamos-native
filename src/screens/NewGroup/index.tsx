import { Container, Content, Icon  } from "./styles";
import { Header } from "@components/Header";
import { HighLight } from "@components/HighLight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";



export function NewGroup() {
    
    const navigation = useNavigation();
    const [group,setGroup] = useState('');
    async function handleNew(){
        try {
            if(group.trim().length == 0){
                return Alert.alert(`Novo grupo `, 'Informe o Nome da turma');
            }

            await groupCreate(group);
        } catch( error ) {
            if(error instanceof AppError ){
                Alert.alert(`Novo grupo `, error.message);
            }else {
                Alert.alert('Novo grupo','Não foi possível criar um novo grupo');
                console.log(error);
            }
        }
        navigation.navigate('players', { group });
    }

    return (
        <Container> 
            <Header showBackButton />
            <Content>
                <Icon />
                <HighLight 
                    title="Nova turma"
                    subtitle="crie a turma para adicionar novas pessoas" 
                /> 
                <Input placeholder="Nome da Turma" onChangeText={setGroup}/>
                <Button title="Criar" onPress={handleNew}/>
            </Content>
        </Container>
    )

}