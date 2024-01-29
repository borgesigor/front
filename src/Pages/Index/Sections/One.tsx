import styled from "styled-components";
import { TitleComponent } from "../../../Components/Title/Title";
import { CardComponent } from "../../../Components/Card/Card";

function SectionComponent() {
  return (
    <>
      <ContainerMain>

        <ContainerWithTwo>

          <TitleWithComponent>
            <TitleComponent title="Reze Conosco"/>
            <Grid $columns={2} $rows={2} >
              <CardComponent href="" title="Missa Online" description="Assista de onde estiver" icon="play" />
              <CardComponent href="" title="Enviar Intenções" description="Intenções para serem lidas em missa" icon="send-2" />
              <CardComponent href="" title="Pedidos de Orações" description="Peça orações que serão realizadas por padres e fiéis" icon="send-1" />
              <CardComponent href="" title="Horários de Celebrações" description="Veja os horários de celebrações" icon="clock" />
            </Grid>
          </TitleWithComponent>

          <TitleWithComponent>
            <TitleComponent title="Serviços" seeMore />
            <Grid $columns={2} $rows={1} >
              <CardComponent href="" title="Batismo" description="Assista de onde estiver" vertical image="https://images.pexels.com/photos/19891488/pexels-photo-19891488/free-photo-of-abstrato-resumo-abstrair-aquatico.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" />
              <CardComponent href="" title="Casamento" description="Assista de onde estiver" vertical image="https://images.pexels.com/photos/19809164/pexels-photo-19809164/free-photo-of-arte-modelo-de-moda-modelo-de-beleza-preto.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" />
            </Grid>
          </TitleWithComponent>

        </ContainerWithTwo>

      </ContainerMain>
    </>
  );
}

const ContainerMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const ContainerWithTwo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  @media screen and (max-width: 1100px) {
    flex-direction: column;
    gap: 4rem;
  } 
`

const TitleWithComponent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
`

const Grid = styled.div<{ $rows: number, $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, 1fr);
  grid-template-rows: repeat(${props => props.$rows}, 1fr);
  gap: 2rem;
  height: 100%;

  @media screen and (max-width: 550px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(auto, 1fr);
  } 
`

export default SectionComponent;