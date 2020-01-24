import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import SearchBar from './SearchBar';

const Header: React.FC = () => {
  return (
    <>
      <AppBar position="static" role="header" color="default">
        <Toolbar>
          <Typography>OpenLMS</Typography>
          <SearchBar />
        </Toolbar>
      </AppBar>
      <Toolbar>
        <IconButton>
          <Icon>menu</Icon>
        </IconButton>
      </Toolbar>
    </>
  );
};

export default Header;
