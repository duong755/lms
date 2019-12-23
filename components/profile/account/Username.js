import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  usernameForm: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  }
}));

const UsernameSettings = (props) => {
  const classes = useStyles();

  return (
    <Box py={2}>
      <Typography>
        <strong>Username</strong>
      </Typography>
      <Box className={clsx(classes.usernameForm)}>
        <TextField value={props.username} />
      </Box>
    </Box>
  );
};

UsernameSettings.propTypes = {
  username: PropTypes.string.isRequired
};

export default UsernameSettings;
