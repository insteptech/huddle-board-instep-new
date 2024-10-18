'use client';
import { createTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import '@iroomit/react-date-range/dist/theme/default.css'; // theme css file

const ProximaNova = localFont({
  src: [
    {
      path: '../font/ProximaNova-Light.woff2',
      weight: '300',
      style: 'normal',
    },

    {
      path: '../font/ProximaNova-Black.woff2',
      weight: '900',
      style: 'normal',
    },

    {
      path: '../font/ProximaNova-Regular.woff2',
      weight: '400',
      style: 'normal',
    },

    {
      path: '../font/ProximaNova-Bold.woff2',
      weight: '700',
      style: 'normal',
    }

  ],
})

const theme = createTheme({
  typography: {
    fontFamily: ProximaNova.style.fontFamily,
  },

},

  {
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: 'none'
        },
      },
    }
  },

  {
    customArgs: {
      hearderBgColor: "#fff",
    }
  });

export default theme;
