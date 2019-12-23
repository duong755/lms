import { useEffect, useContext, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import _ from 'lodash';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import withLayout from '../../components/hoc/withLayout';
import AppUser from '../../components/auth/AppUser';
import AccountSettingsForm from '../../components/profile/account';
import PasswordSettingsForm from '../../components/profile/password';

const SettingsPage = () => {
  const theme = useTheme();
  const userContext = useContext(AppUser);
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('account');
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!_.isObject(userContext.user)) {
      router.replace('/');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <Box py={2}>
        <Container maxWidth="xl">
          <NoSsr>
            <Box display="flex" flexDirection={matchDownSM ? 'column' : 'row'}>
              <Tabs
                orientation={matchDownSM ? 'horizontal' : 'vertical'}
                color="primary"
                textColor="primary"
                indicatorColor="primary"
                value={currentTab}
                onChange={(event, value) => setCurrentTab(value)}
              >
                <Tab color="primary" label="Account" value="account" />
                <Tab color="primary" label="Password" value="password" />
              </Tabs>
              <Box flexGrow={1}>
                {_.isObject(userContext.user) && currentTab === 'account' && (
                  <AccountSettingsForm user={userContext.user} />
                )}
                {_.isObject(userContext.user) && currentTab === 'password' && (
                  <PasswordSettingsForm userId={userContext.user.id} />
                )}
              </Box>
            </Box>
          </NoSsr>
        </Container>
      </Box>
    </>
  );
};

export default withLayout(SettingsPage);
