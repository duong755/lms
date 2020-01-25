import React from 'react';

import NextLink from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import SearchBar from './SearchBar';
import Account from './Account';

const useHeaderStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between'
  },
  left: {
    flex: 1,
    textAlign: 'left'
  },
  middle: {
    flex: 1,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  right: {
    flex: 1,
    textAlign: 'right'
  }
}));

const Header: React.FC = () => {
  const headerClasses = useHeaderStyles();

  return (
    <>
      <AppBar position="static" role="header" color="default">
        <Toolbar className={headerClasses.container}>
          <Box className={headerClasses.left}>
            <NextLink href="/" as="/" prefetch={false}>
              <Link href="/">
                <Typography>OpenLMS</Typography>
              </Link>
            </NextLink>
          </Box>
          <Box className={headerClasses.middle}>
            <SearchBar />
          </Box>
          <Box className={headerClasses.right}>
            <Account />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
