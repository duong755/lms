import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  emailForm: {
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

const EmailSettings = (props) => {
  const classes = useStyles();

  return (
    <Box py={2}>
      <Typography>
        <strong>Email</strong>
      </Typography>
      <Box className={clsx(classes.emailForm)}>
        <TextField value={props.email} />
      </Box>
    </Box>
  );
};

EmailSettings.propTypes = {
  email: PropTypes.string.isRequired
};

export default EmailSettings;
