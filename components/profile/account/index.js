import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import { UserType } from '../../propTypes';

import Avatar from './Avatar';
import Username from './Username';
import Email from './Email';
import Info from './Info';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: theme.spacing(2)
    }
  }
}));

const AccountSettings = (props) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root)}>
      <Avatar image={props.user.info.image} />
      <Divider variant="fullWidth" />
      <Username username={props.user.username} />
      <Divider variant="fullWidth" />
      <Email email={props.user.email} />
      <Divider variant="fullWidth" />
      <Info info={props.user.info} />
    </Box>
  );
};

AccountSettings.propTypes = {
  user: UserType.isRequired
};

export default AccountSettings;
