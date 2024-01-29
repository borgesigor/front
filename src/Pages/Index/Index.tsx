import { BannerComponent } from "../../Components/Banner/Banner"
import { CardComponent } from "../../Components/Card/Card";
import { MainComponent } from "../../Components/Main/Main";
import { TitleComponent } from "../../Components/Title/Title";
import * as stylex from '@stylexjs/stylex'
import { theme } from "../../Themes/theme.stylex";
import { SeeMoreComponent } from "../../Components/SeeMore/SeeMore";
import { isPc } from "../../Utils/GetDeviceType";

export function IndexPage() {
  return ( 
    <>
      <MainComponent>
        <BannerComponent/>

        <div style={{ minHeight: '400px' }} {...stylex.props(container.row, container.rowToColumn, container.mobileLargeGap)} >

          <div {...stylex.props(container.column)} style={{ flex: 1 }} >
            <TitleComponent title="Reze Conosco" />
            <div style={{ height: '100%' }} {...stylex.props(container.grid)} >
              <CardComponent icon="play" responsive title="Missas Online" description="Assista as missas direto de sua casa" />
              <CardComponent icon="instagram" responsive title="Lorem Ipsum" description="Isso ai" />
              <CardComponent icon="instagram" responsive title="Lorem Ipsum" description="Isso ai" />
              <CardComponent icon="instagram" responsive title="Lorem Ipsum" description="Isso ai" />
            </div>
          </div>

          <div {...stylex.props(container.column)} style={{ flex: 1 }} >
            <TitleComponent title="Serviços" seeMore />
            <div style={{ height: '100%' }} {...stylex.props(container.row, container.rowToColumnMobile)} >
              <CardComponent vertical responsive title="Casamento" description="Muitas são as histórias e curiosidades" image="https://www.wedding-spot.com/blog/sites/wsblog/files/images/migrated/106-Bride%2Band%2Bgroom%2Bgetting%2Bmarried%2Binside%2Bchurch.jpg" />
              <CardComponent vertical responsive title="Batismo" description="Veja " image="https://images.pexels.com/photos/38999/the-dew-the-priest-christening-38999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
            </div>
          </div>

        </div>

        <div style={{ minHeight: '400px' }} {...stylex.props(container.column)} >

          <TitleComponent title="Pároco" />

          <div {...stylex.props(container.row, container.rowToColumn)} >
            <div {...stylex.props(paroco.image)} >
              <img style={{ height: '100%', width: '100%', objectFit: 'cover' }} src="https://images.pexels.com/photos/9316207/pexels-photo-9316207.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" />
            </div>
            <div {...stylex.props(container.column, paroco.texts)} >
              <div {...stylex.props(paroco.head)} >
                <span {...stylex.props(paroco.tag)} >Pároco, Paróquia Divino Pai Eterno</span>
                <span {...stylex.props(paroco.title)} >Pe. João Bosco</span>
              </div>
              <SeeMoreComponent active={!isPc()} >
                <span {...stylex.props(paroco.description)} >Na encruzilhada entre tradição e modernidade, nosso estimado pároco surge como uma inspiração única. Sua abordagem carismática e visão moderna tornam a fé mais acessível, acolhedora e vibrante. Em meio aos cânticos tradicionais, encontramos sua sabedoria contemporânea, que ressoa nos corações de uma comunidade dinâmica. Com sua paixão pela inclusão e inovação, ele cria pontes entre gerações, conectando-nos através da espiritualidade e valores atemporais. Nosso pároco é uma bênção, um farol que ilumina o caminho da fé com um toque contemporâneo, renovando a vitalidade espiritual de nossa paróquia. Que sua jornada carismática continue a inspirar, guiando-nos para um futuro cheio de esperança e unidade.</span>
              </SeeMoreComponent>
            </div>
          </div>
        
        </div>

        <div style={{ minHeight: '400px' }} {...stylex.props(container.row, container.rowToColumn, container.mobileLargeGap)} >

          <div {...stylex.props(container.column)} style={{ flex: 1 }} >
            <TitleComponent title="Reze Conosco" />
            <div style={{ height: '100%' }} {...stylex.props(container.grid)} >
              <CardComponent icon="play" responsive title="Missas Online" description="Assista as missas direto de sua casa" />
              <CardComponent icon="instagram" responsive title="Lorem Ipsum" description="Isso ai" />
              <CardComponent icon="instagram" responsive title="Lorem Ipsum" description="Isso ai" />
              <CardComponent icon="instagram" responsive title="Lorem Ipsum" description="Isso ai" />
            </div>
          </div>

          <div {...stylex.props(container.column)} style={{ flex: 1 }} >
            <TitleComponent title="Serviços" seeMore />
            <div style={{ height: '100%' }} {...stylex.props(container.row, container.rowToColumnMobile)} >
              <CardComponent vertical responsive title="Casamento" description="Muitas são as histórias e curiosidades" image="https://www.wedding-spot.com/blog/sites/wsblog/files/images/migrated/106-Bride%2Band%2Bgroom%2Bgetting%2Bmarried%2Binside%2Bchurch.jpg" />
              <CardComponent vertical responsive title="Batismo" description="Veja " image="https://images.pexels.com/photos/38999/the-dew-the-priest-christening-38999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
            </div>
          </div>

        </div>
        
      </MainComponent>

    </>
  );
}

const paroco = stylex.create({
  texts: {
    gap: '2rem',
    lineHeight: '170%',
    flex: 1,
    justifyContent: 'center'
  },
  head: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 600
  },
  tag: {
    fontSize: '0.9rem',
    color: theme.auxiliarColor
  },
  description: {
    fontSize: '0.9rem',
    // fontFamily: theme.secondaryFont,
    color: theme.auxiliarColor
  },
  image: {
    aspectRatio: '16/12',
    width: '100%',
    overflow: 'hidden',
    background: 'red',
    flex: 1
  }
})

const container = stylex.create({
  rowToColumn: {
    flexDirection: {
      default: 'row',
      '@media (max-width: 1100px)': 'column',
    },
  },
  rowToColumnMobile: {
    flexDirection: {
      default: 'row',
      '@media (max-width: 500px)': 'column',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, 1fr)',
      '@media (max-width: 500px)': 'repeat(1, 1fr)',
    },
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '2rem',
  },
  mobileLargeGap: {
    gap: {
      default: '2rem',
      '@media (max-width: 1100px)': '4rem',
    },
  }
})