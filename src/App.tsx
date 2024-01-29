import { HeaderComponent } from "./Components/Header/Header"
import { IndexPage } from "./Pages/Index/Index"
import * as stylex from '@stylexjs/stylex'
import styled, { ThemeProvider } from "styled-components";


const main = stylex.create({
  default: {
    padding: '0 2em',
    maxWidth: '1300px',
    boxSizing: 'border-box',
    margin: '0 auto'
  }
})

const theme = {
  background: '#FFFFFF',
  primaryColor: '#0E0E0E',
  secondaryColor: '#A1A1A1',
  auxiliarColor: '#7A7A7A',
  borderColor: '#D0D0D0',
  borderHardColor: '#666666',
  primaryFont: 'Merriweather, serif',
  secondaryFont: 'Inter, sans-serif',
};

const Main = styled.div`
  padding: 0 2em;
  max-width: 1300px;
  box-sizing: border-box;
  margin: '0 auto';
`

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HeaderComponent/>
      <Main>
        <IndexPage/>
      </Main>
    </ThemeProvider>
  )
}

export default App
