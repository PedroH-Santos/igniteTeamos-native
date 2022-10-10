import { Container, SubTitle, Title } from "./styles";


interface HighLight {
    title: string;
    subtitle: string;
}


export function HighLight({subtitle,title }: HighLight) {

    return (
        <Container>
            <Title> { title} </Title>
            <SubTitle> {subtitle} </SubTitle>
        </Container>
    )
}