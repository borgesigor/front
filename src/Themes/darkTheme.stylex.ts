import * as stylex from '@stylexjs/stylex'
import { theme } from './theme.stylex';

export const darkTheme = stylex.createTheme(theme, {
  background: '#000000',
  primaryColor: '#FFFFFF',
  secondaryColor: 'red'
});