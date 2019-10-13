import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Container } from '@material-ui/core';

function Header() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar className="pl-0 pr-0">
          <IconButton edge="start">
            <Icon>menu</Icon>
          </IconButton>
          <Typography>
            <strong>OpenLMS</strong>
          </Typography>
          <Box className="d-flex justify-content-end flex-grow-1">
            <IconButton edge="end">
              <Icon>account_box</Icon>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
