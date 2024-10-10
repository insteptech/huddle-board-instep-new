import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../app/styles/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import dynamic from 'next/dynamic';
import ReduxProvider from '@/app/redux/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = dynamic(() => import('./components/rootLayout').then((mod) => mod), {
  ssr: false,
});
export const metadata: Metadata = {
  title: 'DoctusTech App',
  description: '',
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {
  return (
    <AppRouterCacheProvider>
      <ReduxProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <html lang="en">
            <body>
              <RootLayout>
                <ToastContainer />
                {children}
              </RootLayout>
            </body>
          </html>
        </ThemeProvider>
      </ReduxProvider>
    </AppRouterCacheProvider>
  );
}
