import { theme } from '../../Themes/theme.stylex';
import Image from '../../assets/background.png'
import * as stylex from '@stylexjs/stylex'

export function BannerComponent() {
  return ( 
    <>
      <div {...stylex.props(banner.default, banner.size)} >

        <div>
          <img {...stylex.props(bannerImage.image)} src={Image} />
          <div {...stylex.props(bannerImage.overlayEffect)}></div>
        </div>

        <div {...stylex.props(bannerOverlay.default)}>
          <div></div>
          <div {...stylex.props(bannerOverlay.texts)} >
            <h1 {...stylex.props(bannerOverlay.title)} >A Antiga Casa do Pai Eterno</h1>
            <p {...stylex.props(bannerOverlay.paragraph)}>Onde a Devoção se Encontra com a Comunhão, Transformando
Corações e Unindo Almas no Amor do Pai Eterno.</p>
          </div>
          <div>
            <button {...stylex.props(buttons.default)}>
              <i className="iconsax" icon-name="location" style={{ fontSize: '1.2rem' }}></i>
              Praça do Santuário, 238 - Centro, Trindade - GO
            </button>
          </div>
        </div>

      </div>
      <div {...stylex.props(banner.size)} ></div>
    </>
  );
}

const banner = stylex.create({
  default: {
    top: '0',
    left: '0',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '0',
  },
  size: {
    width: '100%',
    height: '72vh'
  }
})

const bannerImage = stylex.create({
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    left: '0',
    top: '0',
    filter: 'brightness(100%) contrast(70%)'
  },
  overlayEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    background: '#202020',
    opacity: '43%'
  }
})

const bannerOverlay = stylex.create({
  default: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    padding: '5rem 1rem',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: 'white'
  },
  texts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 600,
    lineHeight: '120%'
  },
  paragraph: {
    fontSize: '1rem',
    fontWeight: '500',
    maxWidth: '34rem',
    fontFamily: theme.secondaryFont,
    color: '#e7e7e7',
    opacity: '80%',
    lineHeight: '170%'
  }
})

const buttons = stylex.create({
  default: {
    background: '#ffffff1d',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    color: 'white',
    transition: '0.3s',
    border: {
      default: '1px solid #ffffff26',
      ':hover': '1px solid #ffffff4c'
    },
    opacity: {
      default: '80%',
      ':hover': '90%'
    },
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: theme.secondaryFont,
    backdropFilter: 'blur(4px)',
    textAlign: 'left',
    lineHeight: '120%',
    fontSize: '0.9rem',
    fontWeight: 400
  }
})

