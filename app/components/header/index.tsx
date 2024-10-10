'use client'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import { LogoIcon } from '../../images';
import { useTheme } from '@mui/material';
import { Typography_Grid, StaticTypo, LinkText } from '../../styles/customStyle';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';



const Header = () => {
  const theme: any = useTheme();
  const huddleBoardConfig: any = localStorage.getItem('huddleBoardConfig');
  const config = huddleBoardConfig && huddleBoardConfig !== undefined || 'undefined' ? JSON.parse(huddleBoardConfig) : "dummy";
  const router = useRouter()


  const logout = () => {

    toast.success("Logout Success", {
      toastId: 'error111',
    })
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/auth/login";
    }, 1000)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar className='headerMain' component="nav" sx={{ p: '15px 20px', boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.03)', position: 'relative', flexDirection: 'row', justifyContent: ' space-between', backgroundColor: theme.customArgs.hearderBgColor }}>
        <LogoIcon />
        <Typography_Grid>
          <StaticTypo variant="caption" display="block" gutterBottom>
            {config?.user_full_name}
          </StaticTypo>

          {config?.hide_logout_button !== true &&
            <LinkText
              onClick={() => logout()}
              sx={{ cursor: "pointer", textDecoration: 'none', borderLeft: '2px solid #C8CED2', paddingLeft: '10px' }}
            >
              Logout
            </LinkText>
          }

        </Typography_Grid>
      </AppBar>
    </Box>

  );
}


export default Header;
