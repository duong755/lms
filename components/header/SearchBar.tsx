import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/Input';
import Icon from '@material-ui/core/Icon';

const useSearchBarClasses = makeStyles((theme) => ({
  root: {
    color: 'inherit',
    borderWidth: 1
  },
  input: {
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 150,
      '&:focus': {
        width: 180
      }
    }
  }
}));

const SearchBar = () => {
  const classes = useSearchBarClasses();

  return <InputBase classes={classes} defaultValue="" startAdornment={<Icon>search</Icon>} />;
};

export default SearchBar;
