import Head from 'next/head';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import dayjs from 'dayjs';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import absURL from '../helpers/URL';
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

function CourseTab(props) {
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
          {tabName.replace(/_/g, ' ')}
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
        {tabName.replace(/_/g, ' ')}
      </Button>
    </NextLink>
  );
}

/**
 *
 * @param {React.FC} CoursePage
 * @param {string} tab
 */
function withCourseLayout(CoursePage, tab) {
  const tabs = ['lesson', 'exercise', 'exam', 'member', 'join_request'];

  const FullCoursePage = (props) => {
    const { user, course } = props;

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
            <Box>
              {tabs.map((currentTabName) => (
                <CourseTab
                  key={currentTabName}
                  tabName={currentTabName}
                  focusTab={tab}
                  userId={props.userId}
                  courseId={props.courseId}
                />
              ))}
            </Box>
            <CoursePage tab={tab} {...props} />
          </Container>
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
