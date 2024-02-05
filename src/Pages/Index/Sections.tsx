import styled from "styled-components";
import { TitleComponent } from "../../Components/Title/Title";
import { CardComponent } from "../../Components/Card/Card";
import { SeeMoreComponent } from "../../Components/SeeMore/SeeMore";
import { ButtonComponent } from "../../Components/Button/Button";

export function SectionOneComponent() {
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

export function SectionTwoComponent() {
  return (
    <>
      <ContainerMain>

        <TitleWithComponent>
          <TitleComponent title="A Igreja"/>
          <Grid $columns={2} $rows={1} $changeInScreenSize={1100} >
            <img loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '500px' }} src="https://curtamais.com.br/goiania/wp-content/uploads/sites/2/2020/07/d1e1482ea0b75a82c130e897c40dcc9a-1024x682.jpeg" alt="" />
            <Text>
              <h3 style={{ fontWeight: 600, maxWidth: '60vw', lineHeight: '170%' }} >Paróquia do Divino Pai Eterno</h3>
              <SeeMoreComponent>
                <p>Na antiga região do Barro Preto, hoje Trindade (GO), a primeira capela dedicada ao Divino Pai Eterno foi construída em 1843 e era coberta com folhas de buriti. Com o aumento da devoção que, já naquela época, conquistava cada vez mais corações, e com o fortalecimento da fé, capelas maiores foram edificadas.</p>
              </SeeMoreComponent>
              <Buttons>
                <ButtonComponent>
                  História da Paróquia
                </ButtonComponent>
                <ButtonComponent inverted>
                  História do Medalhão
                </ButtonComponent>
              </Buttons>
            </Text>
          </Grid>
        </TitleWithComponent>

      </ContainerMain>
    </>
  );
}

const Buttons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media screen and (max-width: 1100px) {
    flex-direction: column;

    button{
      width: 100%;
      padding: 1rem 0;
    }
  } 
`

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* height: fit-content; */
  justify-content: center;
  
  h3{
    font-size: 1.5rem;
  }

  p{
    line-height: 170%;
    font-family: ${props => props.theme.secondaryFont};
    opacity: 70%;
  }
`

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

const Grid = styled.div<{ $rows: number, $columns: number, $changeInScreenSize?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, 1fr);
  grid-template-rows: repeat(${props => props.$rows}, 1fr);
  gap: 2rem;
  height: 100%;

  @media screen and (max-width: ${props => props.$changeInScreenSize ? props.$changeInScreenSize : '550' }px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(auto, 1fr);
  } 
`