import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';

import { useCookies } from 'react-cookie';

function Header() {
  const [cookies, setCookie] = useCookies(['paletteType']);

  function toggleTheme() {
    switch (cookies['paletteType']) {
      case 'dark':
        setCookie('paletteType', 'light');
        break;
      case 'light':
        setCookie('paletteType', 'dark');
        break;
      default:
        setCookie('paletteType', 'dark');
        break;
    }
  }
  function themeIcon() {
    if (cookies['paletteType'] === 'dark') {
      return 'brightness_2';
    }
    return 'brightness_high';
  }

  return (
    <AppBar color="default" position="static">
      <Container maxWidth="xl">
        <Toolbar style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Box color="text.primary" display="flex" alignItems="center" alignSelf="stretch">
            <Typography>OpenLMS</Typography>
          </Box>
          <Box display="flex" flexGrow={1} justifyContent="flex-end">
            <IconButton color="default" onClick={toggleTheme}>
              <NoSsr>
                <Icon color="inherit">{themeIcon()}</Icon>
              </NoSsr>
            </IconButton>
            <IconButton>
              <Icon>account_box</Icon>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
