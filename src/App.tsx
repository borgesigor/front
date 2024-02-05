import { HeaderComponent } from "./Components/Header/Header"
import { IndexPage } from "./Pages/Index/Index"
import styled, { ThemeProvider } from "styled-components";

const theme = {
  background: '#FFFFFF',
  primaryColor: '#242424',
  secondaryColor: '#A1A1A1',
  auxiliarColor: '#7A7A7A',
  borderColor: '#D0D0D0',
  borderHardColor: '#666666',
  primaryFont: 'Merriweather, serif',
  secondaryFont: 'Inter, sans-serif',
  headerWidth: '1660px'
};

const Main = styled.div`
  padding: 0 2em;
  background: ${props => props.theme.background};  
`

const MainWrapper = styled.div`
  max-width: 1280px;
  box-sizing: border-box;
  margin: 0 auto;
  font-family: ${props => props.theme.primaryFont};
  color: ${props => props.theme.primaryColor};  
`

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HeaderComponent/>
        <Main>
          <MainWrapper>
            <IndexPage/>
          </MainWrapper>
        </Main>
    </ThemeProvider>
  )
}

export default App
