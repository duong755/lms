import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';

import { useSettingsFormStyles } from '../../styles/settingsForm';

const useStyles = makeStyles((theme) => ({
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
  const formClasses = useSettingsFormStyles();

  return (
    <Box py={2}>
      <Typography>
        <strong>Avatar</strong>
      </Typography>
      <Box className={clsx(formClasses.form)}>
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
