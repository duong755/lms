import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import { UserType } from '../../propTypes';

import Avatar from './Avatar';
import Username from './Username';
import Email from './Email';
import Info from './Info';

const AccountSettings = (props) => {
  return (
    <Box>
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
