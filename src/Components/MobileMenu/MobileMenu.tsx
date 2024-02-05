import styled from 'styled-components'

export function MobileMenuComponent(){
  return(
    <MenuContainer>
      <Head>

      </Head>
      <Body>
        
      </Body>
    </MenuContainer>
  )
}

const MenuContainer = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0px;
  left: 0px;
  background: ${props => props.theme.background};
`

const Head = styled.div`

`

const Body = styled.div`

`