import { BackButton, BackIcon, Container, Logo } from "./styles"

import logoImg from "@assets/logo.png"
import { useNavigation } from "@react-navigation/native";

type Props = {
    showBackButton?: Boolean,
}



export function Header({ showBackButton = false }: Props) {

    const navigation = useNavigation();

    function hanldeGoBack() {
        navigation.navigate('groups');
    }


    return (
        <Container>
            {showBackButton && (
                <BackButton onPress={hanldeGoBack}>
                    <BackIcon />
                </BackButton>
            )}
            <Logo source={logoImg} />
        </Container>
    );
} 