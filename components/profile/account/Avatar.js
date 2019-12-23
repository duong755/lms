import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  avatarForm: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  avatar: {
    cursor: 'pointer',
    borderWidth: 5,
    borderStyle: 'solid',
    borderColor: theme.palette.grey.A100,
    width: 80,
    height: 80
  }
}));

const AvatarSettings = (props) => {
  const classes = useStyles();

  return (
    <Box py={2}>
      <Typography>
        <strong>Avatar</strong>
      </Typography>
      <Box className={clsx(classes.avatarForm)}>
        <Avatar className={clsx(classes.avatar)} src={props.image} />
        &nbsp;&nbsp;
        <Link href="https://gravatar.com" target="_blank">
          Change image on gravatar
        </Link>
      </Box>
    </Box>
  );
};

AvatarSettings.propTypes = {
  image: PropTypes.string
};

export default AvatarSettings;
