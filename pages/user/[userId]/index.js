import { useState } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import _ from 'lodash';
import fetch from 'isomorphic-unfetch';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import withLayout from '../../../components/lib/withLayout';
import absURL from '../../../components/helpers/URL';

const useStyles = makeStyles((theme) => ({
  courseContainer: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(2, 0)
  },
  courseDescription: {
    padding: theme.spacing(2, 0)
  },
  courseTopic: {
    marginRight: theme.spacing(2)
  },
  userInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  userAvatar: {
    margin: theme.spacing(5),
    borderWidth: 3,
    borderColor: theme.palette.grey[500],
    borderStyle: 'solid',
    width: 80,
    height: 80
  },
  usernameAndType: {
    margin: theme.spacing(0, 5, 0, 5),
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  otherInfo: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

function ProfilePage(props) {
  const { currentUser, total = 0 } = props;
  const [currentTab, setCurrentTab] = useState(0);
  const classes = useStyles();

  const otherInfo =
    currentUser && _.toPairs(currentUser.info).filter((currentPair) => currentPair[0] !== 'image' && currentPair[1]);

  return (
    <>
      <Head>
        <title>{currentUser ? `${currentUser.username}'s profile` : 'User Not Found'}</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          {currentUser ? (
            <>
              <Box className={clsx(classes.userInfoContainer)}>
                <Avatar className={clsx(classes.userAvatar)} src={currentUser.info.image} />
                <Box className={clsx(classes.usernameAndType)}>
                  <Typography variant="h5">
                    <strong>{currentUser.username}</strong>
                  </Typography>
                  <Typography variant="caption">
                    {currentUser.type === 'teacher' && <Typography>Teacher</Typography>}
                    {currentUser.type === 'student' && <Typography>Student</Typography>}
                  </Typography>
                  <Box className={clsx(classes.otherInfo)}>
                    {otherInfo.map((currentPair) => (
                      <Typography key={currentPair[0]} variant="caption">{`${currentPair[0]}: ${
                        currentPair[1]
                      }`}</Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Tabs
                indicatorColor="primary"
                textColor="primary"
                value={currentTab}
                onChange={(event, value) => {
                  setCurrentTab(value);
                }}
              >
                <Tab value={0} label={`Courses (${total})`} />
              </Tabs>
            </>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" p={5}>
              <Icon fontSize="large">account_circle</Icon>
              <Typography variant="h4">
                <strong>User Not Found</strong>
              </Typography>
              <Typography component="h4" variant="h4">
                404
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}

ProfilePage.getInitialProps = async (context) => {
  const { userId } = context.query;
  let userData = null;
  let courseData = null;

  try {
    const userResponse = await fetch(absURL(`/api/user/${userId}`));
    userData = await userResponse.json();
    const courseResponse = await fetch(absURL(`/api/user/${userId}/course`));
    courseData = await courseResponse.json();
  } catch (err) {
    console.error(err);
  }

  return {
    currentUser: userData && userData.user,
    ...courseData
  };
};

ProfilePage.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['teacher', 'student']).isRequired,
    info: PropTypes.shape({
      fullname: PropTypes.string,
      birthday: PropTypes.string,
      image: PropTypes.string
    })
  }),
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      course_name: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      members: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  total: PropTypes.number
};

export default withLayout(ProfilePage);
