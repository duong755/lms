import { useContext, useCallback, useState, useEffect, createContext } from 'react';
import NextLink from 'next/link';
import Router, { useRouter } from 'next/router';
import clsx from 'clsx';
import { isObject, isEqual } from 'lodash';

import { useTheme } from '@material-ui/core/styles';
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
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputBase from '@material-ui/core/InputBase';

import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import AppTheme from './theme/AppTheme';
import AppUser from './auth/AppUser';
import absURL from './helpers/URL';
import { useHeaderStyles } from './styles/header';

const AppSearch = createContext({
  query: '',
  setQuery: () => {},
  submitSearch: () => {}
});

/**
 *
 * @param {React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>} event
 */
function handleSubmitSearch(event) {
  if (event.keyCode === 13 && event.currentTarget.value.trim()) {
    Router.push(`/?query=${event.target.value}`);
  }
}

const Account = () => {
  const userContext = useContext(AppUser);
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const classes = useHeaderStyles();
  const router = useRouter();

  const signOut = useCallback(() => {
    fetch(absURL('/api/signout'), {
      method: 'DELETE',
      credentials: 'include',
      mode: 'same-origin'
    })
      .then((res) => {
        if (res.ok) {
          userContext.setUser(null);
          router.reload();
        }
      })
      .catch(console.error);
  }, []);

  const Search = useCallback(() => {
    return (
      <AppSearch.Consumer>
        {({ query, setQuery, submitSearch }) => {
          return (
            <InputBase
              fullWidth
              startAdornment={<Icon>search</Icon>}
              placeholder="Search..."
              classes={{
                root: classes.searchMenuRoot,
                input: classes.searchMenuInput
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyUp={submitSearch}
            />
          );
        }}
      </AppSearch.Consumer>
    );
  }, []);

  if (isObject(userContext.user)) {
    const { id, username, info } = userContext.user;
    if (matchDownSM) {
      return (
        <Box className={clsx([classes.menu])}>
          <Box alignSelf="stretch">
            <Search />
          </Box>
          <Box display="flex" alignItems="center" alignSelf="flex-end" py={1}>
            <Avatar classes={{ img: classes.avatar }} src={info.image} />
            <NextLink href={'/user/[userId]'} as={`/user/${id}`} prefetch={false}>
              <Link href={`/user/${id}`}>
                <Typography component="h3">
                  <strong>{username}</strong>
                </Typography>
              </Link>
            </NextLink>
          </Box>
          {userContext.user.type === 'teacher' && (
            <Box display="flex" alignItems="center" alignSelf="flex-end" py={1}>
              <NextLink href="/create-course" as="/create-course" prefetch={false}>
                <Link href="/create-course" color="inherit">
                  Create course
                </Link>
              </NextLink>
            </Box>
          )}
          <Divider color={theme.palette.divider} />
          <Box display="flex" alignItems="center" justifyContent="flex-end" py={1} onClick={signOut}>
            <Icon>exit_to_app</Icon>&nbsp;<strong>Sign Out</strong>
          </Box>
        </Box>
      );
    }
    return (
      <Box className={clsx([classes.menu])}>
        <UncontrolledDropdown>
          <DropdownToggle className={clsx([classes.avatarContainer])} tag="span" caret>
            <Avatar classes={{ img: classes.avatar }} src={info.image} />
          </DropdownToggle>
          <DropdownMenu right>
            <NextLink href={'/user/[userId]'} as={`/user/${id}`} prefetch={false}>
              <DropdownItem href={`/user/${id}`} title={username} className={clsx([classes.username])}>
                {username}
              </DropdownItem>
            </NextLink>
            {userContext.user.type === 'teacher' && (
              <NextLink href="/create-course" as="/create-course" prefetch={false}>
                <DropdownItem href="/create-course">Create course</DropdownItem>
              </NextLink>
            )}
            <DropdownItem divider />
            <DropdownItem onClick={signOut}>Sign out</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Box>
    );
  }
  return (
    <Box display="flex" flexDirection="column">
      {matchDownSM && (
        <Box alignSelf="stretch">
          <Search />
        </Box>
      )}
      <Box display="flex" alignItems="center" justifyContent="flex-end" py={1}>
        {!router.asPath.startsWith('/signin') && (
          <NextLink href={`/signin?redirect=${encodeURIComponent(router.asPath)}`} prefetch={false}>
            <Button variant="text">Sign in</Button>
          </NextLink>
        )}
        &nbsp;&nbsp;
        {!router.asPath.startsWith('/signup') && (
          <NextLink href="/signup" as={{ path: '/signup' }} prefetch={false}>
            <Button variant="outlined">Sign up</Button>
          </NextLink>
        )}
      </Box>
    </Box>
  );
};

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchingUser, setFetchingUser] = useState(true);
  const [menuExpand, setMenuExpand] = useState(false);
  const themeContext = useContext(AppTheme);
  const userContext = useContext(AppUser);
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const classes = useHeaderStyles();

  useEffect(() => {
    fetch(absURL('/api/user'), {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin'
    })
      .then(async (response) => {
        const json = await response.json();
        if (!isEqual(json, userContext.user)) {
          if (isObject(json)) {
            userContext.setUser(json);
          } else {
            userContext.setUser(null);
          }
        }
      })
      .catch(() => {
        userContext.setUser(null);
      })
      .finally(() => {
        setFetchingUser(false);
      });
  }, []);

  const themeIcon = useCallback(() => {
    if (themeContext.theme === 'dark') {
      return 'brightness_2';
    }
    return 'brightness_high';
  }, [themeContext.theme]);

  const toggleMenu = useCallback(() => {
    setMenuExpand(!menuExpand);
  }, [menuExpand]);

  return (
    <AppSearch.Provider value={{ query: searchQuery, setQuery: setSearchQuery, submitSearch: handleSubmitSearch }}>
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
                <NextLink href="/" prefetch={false}>
                  <Link className={clsx(classes.brandLink)} href="/">
                    <Typography>
                      <strong>OpenLMS</strong>
                    </Typography>
                  </Link>
                </NextLink>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <NoSsr>
                  <AppSearch.Consumer>
                    {({ query, setQuery, submitSearch }) => {
                      return (
                        <InputBase
                          startAdornment={<Icon>search</Icon>}
                          placeholder="Search..."
                          classes={{
                            root: classes.searchRoot,
                            input: classes.searchInput
                          }}
                          inputProps={{ 'aria-label': 'search' }}
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          onKeyUp={submitSearch}
                        />
                      );
                    }}
                  </AppSearch.Consumer>
                </NoSsr>
                <IconButton color="default" onClick={themeContext.toggleTheme}>
                  <Icon color="inherit">{themeIcon()}</Icon>
                </IconButton>
                <Hidden mdUp>
                  <IconButton color="default" onClick={toggleMenu}>
                    <Icon color="inherit">menu</Icon>
                  </IconButton>
                </Hidden>
              </Box>
            </Box>

            <Box
              className={clsx({
                [classes.showMenu]: !matchDownSM,
                [classes.hideMenu]: matchDownSM && !menuExpand
              })}
            >
              <NoSsr>{fetchingUser ? <CircularProgress color="primary" /> : <Account />}</NoSsr>
            </Box>
          </Box>
        </Container>
      </AppBar>
    </AppSearch.Provider>
  );
};

export default Header;
