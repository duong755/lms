import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Icon from '@material-ui/core/Icon';

const useSearchBarClasses = makeStyles((theme) => ({
  root: {
    color: 'inherit',
    borderWidth: 1
  },
  input: {
    transition: theme.transitions.create('width'),
    padding: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 150,
      '&:focus': {
        width: 200
      }
    }
  }
}));

const SearchBar = () => {
  const classes = useSearchBarClasses();

  return <OutlinedInput classes={classes} defaultValue="" startAdornment={<Icon>search</Icon>} />;
};

export default SearchBar;
