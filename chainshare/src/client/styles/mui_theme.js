import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/fira-sans/300.css';
import '@fontsource/fira-sans/400.css';
import '@fontsource/fira-sans/500.css';
import '@fontsource/fira-sans/700.css';
import '@fontsource/fira-sans/800.css';

const theme = createTheme({
    MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            boxShadow: 'none',
            fontWeight: 'normal',
          },
          sizeSmall: {
            height: '50px',
            width: '144px',
          },
          sizeMedium: {
            height: '50px',
            width: '300px',
          },
          sizeLarge: {
            height: '60px',
            width: '410px',
          },
        }
      },
    typography: {
        fontFamily: [
            'Fira Sans',
            'sans-serif',
        ].join(','),
      },

});

export default theme;