import { useContext, useMemo, useCallback, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import _ from 'lodash';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import fetch from 'isomorphic-unfetch';
import dayjs from 'dayjs';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import NoSsr from '@material-ui/core/NoSsr';
import Snackbar from '@material-ui/core/Snackbar';

import absURL from '../helpers/URL';
import AppUser from '../auth/AppUser';
import { UserType, CourseType } from '../propTypes';

const useStyles = makeStyles((theme) => ({
  tab: {
    marginRight: theme.spacing(2),
    '&.focus:hover': {
      color: theme.palette.common.white
    },
    '&:hover': {
      color: theme.palette.text.primary
    }
  }
}));

const CourseTab = (props) => {
  const { tabName, focusTab, userId, courseId } = props;
  const classes = useStyles();

  if (tabName === focusTab) {
    return (
      <NextLink
        href={`/user/[userId]/course/[courseId]/${tabName}`}
        as={`/user/${userId}/course/${courseId}/${tabName}`}
        prefetch={false}
      >
        <Button className={clsx(classes.tab, 'focus')} color="primary" variant="contained">
          {_.capitalize(tabName.replace(/_/g, ' '))}
        </Button>
      </NextLink>
    );
  }
  return (
    <NextLink
      href={`/user/[userId]/course/[courseId]/${tabName}`}
      as={`/user/${userId}/course/${courseId}/${tabName}`}
      prefetch={false}
    >
      <Button
        href={`/user/${userId}/course/${courseId}/${tabName}`}
        className={clsx(classes.tab)}
        color="default"
        variant="text"
      >
        {_.capitalize(tabName.replace(/_/g, ' '))}
      </Button>
    </NextLink>
  );
};

/**
 *
 * @param {React.FC} CoursePage
 * @param {string} tab
 */
function withCourseLayout(CoursePage, tab) {
  const tabs = ['lesson', 'exercise', 'exam', 'member', 'join_request'];

  const FullCoursePage = (props) => {
    const { user, course } = props;
    const [notification, setNotification] = useState({ open: false, action: '', message: '' });
    const userContext = useContext(AppUser);
    const isStudent = useMemo(() => {
      return _.isObject(userContext.user) && userContext.user.type === 'student';
    }, [userContext.user]);

    const isCourseCreator = useMemo(() => {
      if (_.isObject(userContext.user)) {
        return user.id === userContext.user.id;
      }
      return false;
    }, [userContext.user]);
    const isMember = useMemo(() => {
      if (_.isObject(userContext.user)) {
        if (userContext.user.type === 'teacher') {
          return false;
        } else {
          if (!course.members) {
            return false;
          } else if (course.members instanceof Array) {
            return course.members.indexOf(userContext.user.id) > -1;
          }
          return course.members === userContext.user.id;
        }
      }
      return false;
    }, [userContext.user]);

    const sendJoinRequest = useCallback(async () => {
      if (_.isObject(userContext.user)) {
        try {
          const createJoinRequestRes = await fetch(
            absURL(`/api/user/${course.teacher_id}/course/${course.id}/join_request`),
            {
              method: 'POST',
              credentials: 'include'
            }
          );
          const json = await createJoinRequestRes.json();
          if (createJoinRequestRes.ok) {
            setNotification({ open: true, action: <Icon>check</Icon>, message: 'Sent join request' });
          } else {
            if (createJoinRequestRes.status === 400) {
              setNotification({ open: true, action: <Icon>close</Icon>, message: json.error });
            } else {
              setNotification({ open: true, action: <Icon>close</Icon>, message: 'Cannot send join request' });
            }
          }
        } catch {
          setNotification({ open: true, action: <Icon>close</Icon>, message: 'Cannot send join request' });
        }
      }
    }, [course, userContext.user]);

    const createdAtString = `Created on ${dayjs(course.created_at).format('YYYY MMM d')} at ${dayjs(
      course.created_at
    ).format('hh:mm A')}`;

    return (
      <>
        <Head>
          <title>{course.course_name}</title>
        </Head>
        <Box>
          <Container maxWidth="xl">
            <Box pt={3}>
              <Breadcrumbs separator="/" aria-label="breadcrumb">
                <NextLink href="/user/[userId]" as={`/user/${user.id}`} prefetch={false}>
                  <Link color="textPrimary" href={`/user/${user.id}`}>
                    <Typography variant="h5">{user.username}</Typography>
                  </Link>
                </NextLink>
                <Typography variant="h5" color="textPrimary">
                  <strong>{course.course_name}</strong>
                </Typography>
              </Breadcrumbs>
            </Box>
            <Box py={2} display="flex" alignItems="center">
              <Icon>calendar_today</Icon>
              &nbsp;
              <Box display="inline">{createdAtString}</Box>
            </Box>
            <NoSsr>
              {isStudent && !isMember && (
                <Button variant="contained" color="primary" onClick={sendJoinRequest}>
                  Send join request
                </Button>
              )}
            </NoSsr>
            <Box>
              <NoSsr>
                {(isMember || isCourseCreator) &&
                  tabs.map((currentTabName) => (
                    <CourseTab
                      key={currentTabName}
                      tabName={currentTabName}
                      focusTab={tab}
                      userId={props.userId}
                      courseId={props.courseId}
                    />
                  ))}
              </NoSsr>
            </Box>
            <CoursePage tab={tab} {...props} />
          </Container>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={3000}
            onClose={() => setNotification({ open: false, message: '', action: '' })}
            {...notification}
          />
        </Box>
      </>
    );
  };

  FullCoursePage.propTypes = {
    userId: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    user: UserType,
    course: CourseType
  };

  FullCoursePage.getInitialProps = async (context) => {
    const { userId, courseId } = context.query;
    let user = {};
    let course = {};
    let coursePageProps = {};
    if (CoursePage.getInitialProps) {
      coursePageProps = await CoursePage.getInitialProps(context);
    }
    try {
      const courseResponse = await fetch(absURL(`/api/user/${userId}/course/${courseId}`));
      const userResponse = await fetch(absURL(`/api/user/${userId}`));
      course = await courseResponse.json();
      user = await userResponse.json();
    } catch (err) {
      console.error(err);
    }

    return { userId: userId, courseId: courseId, ...course, ...user, ...coursePageProps };
  };

  return FullCoursePage;
}

CourseTab.propTypes = {
  tabName: PropTypes.string.isRequired,
  focusTab: PropTypes.string,
  userId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired
};

export default withCourseLayout;
