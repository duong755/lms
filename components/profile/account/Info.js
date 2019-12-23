import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  infoForm: {
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

const InfoSettings = (props) => {
  const classes = useStyles();

  return (
    <Box py={2}>
      <Typography>
        <strong>Info</strong>
      </Typography>
      <Box className={clsx(classes.infoForm)}>
        <TextField value={props.info.fullname} />
        <TextField value={props.info.birthday} />
      </Box>
    </Box>
  );
};

InfoSettings.propTypes = {
  info: PropTypes.shape({
    fullname: PropTypes.string,
    birthday: PropTypes.string
  }).isRequired
};

export default InfoSettings;
