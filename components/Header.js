import { useContext, useCallback, useState } from 'react';
import NextLink from 'next/link';
import clsx from 'clsx';

import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import Hidden from '@material-ui/core/Hidden';

import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import AppTheme from './theme/AppTheme';
import AppUser from './auth/AppUser';

const useStyles = makeStyles((theme) => ({
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  showMenu: {
    display: 'flex',
    alignItems: 'center'
  },
  hideMenu: {
    display: 'none',
    alignItems: 'center',
    verticalAlign: 'middle'
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-end'
    }
  },
  username: {
    maxWidth: 300,
    whiteSpace: 'pre-wrap',
    fontWeight: 700
  }
}));

function Header() {
  const [menuExpand, setMenuExpand] = useState(false);
  const themeContext = useContext(AppTheme);
  const userContext = useContext(AppUser);
  const theme = useTheme();
  const matchDownXS = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true });
  const classes = useStyles();

  const themeIcon = useCallback(() => {
    if (themeContext.theme === 'dark') {
      return 'brightness_2';
    }
    return 'brightness_high';
  }, [themeContext.theme]);

  const toggleMenu = useCallback(() => {
    setMenuExpand(!menuExpand);
  }, [menuExpand]);

  const Account = useCallback(() => {
    if (userContext.user) {
      const { id, username, info } = userContext.user;
      if (matchDownXS) {
        return (
          <Box className={clsx([classes.menu])}>
            <Box display="flex" alignItems="center" justifyContent="flex-end" py={1}>
              <img src={info.image} width={30} height={30} />
              <NextLink href={`/user/${id}`} as={`/user/${id}`} prefetch={false}>
                <Typography component="h3">
                  <strong>{username}</strong>
                </Typography>
              </NextLink>
            </Box>
            <Divider color={theme.palette.divider} />
            <Box display="flex" alignItems="center" justifyContent="flex-end" py={1}>
              <Icon>exit_to_app</Icon>&nbsp;<strong>Sign Out</strong>
            </Box>
          </Box>
        );
      }
      return (
        <Box className={clsx([classes.menu])}>
          <UncontrolledDropdown>
            <DropdownToggle tag="span" caret>
              <img src={info.image} width={30} height={30} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem className={clsx([classes.username])}>
                <NextLink href={`/user/${id}`} as={`/user/${id}`} prefetch={false}>
                  {username}
                </NextLink>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Sign out</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Box>
      );
    }
    return (
      <Box display="flex" alignItems="center" justifyContent="flex-end" py={1}>
        <NextLink href="/signin" as={{ path: '/signin' }} prefetch={false}>
          <Button variant="text">Sign in</Button>
        </NextLink>
        &nbsp;&nbsp;
        <NextLink href="/signup" as={{ path: '/signup' }} prefetch={false}>
          <Button variant="outlined">Sign up</Button>
        </NextLink>
      </Box>
    );
  }, [userContext.user, matchDownXS]);

  return (
    <AppBar color="default" position="static">
      <Container maxWidth="xl">
        <Box className={clsx([classes.navbar])}>
          <Box display="flex" justifyContent="space-between" flexGrow={1}>
            <Box
              bgcolor={theme.palette.primary.main}
              color={theme.palette.common.white}
              display="flex"
              alignItems="center"
              alignSelf="stretch"
              px={theme.spacing(0.5)}
            >
              <Typography>
                <strong>OpenLMS</strong>
              </Typography>
            </Box>
            <Box>
              <IconButton color="default">
                <Icon color="inherit">search</Icon>
              </IconButton>
              <IconButton color="default" onClick={themeContext.toggleTheme}>
                <Icon color="inherit">{themeIcon()}</Icon>
              </IconButton>
              <Hidden smUp>
                <IconButton color="default" onClick={toggleMenu}>
                  <Icon color="inherit">menu</Icon>
                </IconButton>
              </Hidden>
            </Box>
          </Box>
          <NoSsr>
            <Box
              className={clsx({
                [classes.showMenu]: !matchDownXS,
                [classes.hideMenu]: matchDownXS && !menuExpand
              })}
            >
              <Account />
            </Box>
          </NoSsr>
        </Box>
      </Container>
    </AppBar>
  );
}

export default Header;
