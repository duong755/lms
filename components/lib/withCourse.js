import NextLink from 'next/link';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

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
      <NextLink href={`/user/${userId}/course/${courseId}/${tabName}`} prefetch={false}>
        <Button
          href={`/user/${userId}/course/${courseId}/${tabName}`}
          className={clsx(classes.tab, 'focus')}
          color="primary"
          variant="contained"
        >
          {tabName}
        </Button>
      </NextLink>
    );
  }
  return (
    <NextLink href={`/user/${userId}/course/${courseId}/${tabName}`} prefetch={false}>
      <Button
        href={`/user/${userId}/course/${courseId}/${tabName}`}
        className={clsx(classes.tab)}
        color="default"
        variant="text"
      >
        {tabName}
      </Button>
    </NextLink>
  );
}

/**
 *
 * @param {React.FC} CoursePage
 * @param {string} tab
 */
function withCourse(CoursePage, tab = 'lesson') {
  const tabs = ['lesson', 'exercise', 'exam', 'member', 'join_request'];

  const FullCoursePage = (props) => {
    return (
      <Box>
        <Container maxWidth="xl">
          <Box pt={3}>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink href="/">
                <Link color="inherit" href="/">
                  <Typography variant="h5">Username</Typography>
                </Link>
              </NextLink>
              <Typography variant="h5" color="textPrimary">
                <strong>Course Name</strong>
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box py={2} display="flex" alignItems="center">
            <Icon>calendar_today</Icon>
            <Box display="inline">Create on someday</Box>
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
    );
  };

  FullCoursePage.propTypes = {
    userId: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired
  };

  FullCoursePage.getInitialProps = async (context) => {
    const { userId, courseId } = context.query;
    let coursePageProps = {};
    if (CoursePage.getInitialProps) {
      coursePageProps = await CoursePage.getInitialProps(context);
    }
    return { userId: userId, courseId: courseId, ...coursePageProps };
  };

  return FullCoursePage;
}

CourseTab.propTypes = {
  tabName: PropTypes.string.isRequired,
  focusTab: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired
};

export default withCourse;
