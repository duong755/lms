/**
 * @typedef {'teacher' | 'student'} UserType
 * @typedef {{ id: string, email: string, username: string, type: UserType, info: Object<string, string> }} User
 * @typedef {{ id: string, teacher_id: string, course_name: string, created_at: string, archive?: boolean, description?: string, topics?: string | string[], members?: string | string[] }} Course
 * @typedef {{ currentUser?: User | null, total?: number | null, courses?: Course[] }} ProfilePageProps
 */
import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import _ from 'lodash';
import fetch from 'isomorphic-unfetch';
import clsx from 'clsx';
import dayjs from 'dayjs';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import withLayout from '../../../components/lib/withLayout';
import absURL from '../../../components/helpers/URL';

const useStyles = makeStyles((theme) => ({
  courseContainer: {
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0)
  },
  courseDescription: {
    padding: theme.spacing(1, 0)
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
  },
  cell: {
    padding: theme.spacing(2, 0)
  }
}));

/**
 * @type {React.FunctionComponent<{ course: Course }>}
 */
const CourseItem = (props) => {
  const { course } = props;
  const { id, teacher_id, course_name, created_at, description, archive, topics, members } = course;
  const classes = useStyles();

  const allTopics = topics ? ((topics instanceof Array ? topics : [topics])) : [];

  const courseMembers = useCallback((members) => {
    if (members) {
      if (members instanceof Array) {
        return members.length;
      }
      return 1;
    }
    return 0;
  }, []);

  return ((
    <Paper className={clsx(classes.courseContainer)}>
      <Typography variant="h5">
        <NextLink href="/user/[userId]/course/[courseId]" as={`/user/${teacher_id}/course/${id}`} prefetch={false}>
          <Link href={`/user/${teacher_id}/course/${id}`} color="primary">
            <strong>{course_name}</strong>
          </Link>
        </NextLink>
        {archive && (
          <Button size="small" variant="outlined">
            Archived
          </Button>
        )}
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center">
            <Icon>access_time</Icon>&nbsp;
            <Typography variant="caption">{dayjs(created_at).format('YYYY MMM d, hh:mm A')}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center">
            <Icon>group</Icon>&nbsp;
            <Typography variant="caption">{courseMembers(members)} members</Typography>
          </Box>
        </Grid>
      </Grid>
      <Box py={2}>
        <Typography>{description}</Typography>
      </Box>
      <Box>
        {allTopics.map((currentTopic) => (
          <Box component="span" key={currentTopic} mr={1}>
            <Button variant="contained" color="primary" size="small">
              {currentTopic}
            </Button>
          </Box>
        ))}
      </Box>
    </Paper>
  ));
};

/**
 * @type {React.FunctionComponent<ProfilePageProps>}
 */
const ProfilePage = (props) => {
  const { currentUser } = props;
  const [currentTab, setCurrentTab] = useState(0);
  const [totalCourses, setTotalCourses] = useState(Number(props.total));
  const [courses, setCourses] = useState(props.courses);
  const [currentPage, setCurrentPage] = useState(1);
  const classes = useStyles();

  useEffect(() => {
    const urlPath = `/api/user/${currentUser.id}/course?page=${currentPage}`;
    (async () => {
      try {
        const coursesRes = await fetch(absURL(urlPath), {
          method: 'GET',
          credentials: 'include',
          mode: 'same-origin'
        });
        const json = await coursesRes.json();
        setCourses(json.courses);
        setTotalCourses(json.total);
      } catch (courseErr) {
        console.error(courseErr);
      }
    })();
  }, [currentPage]);

  const otherInfo =
    currentUser && _.toPairs(currentUser.info).filter((currentPair) => currentPair[0] !== 'image' && currentPair[1]);

  return ((
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
                <Tab value={0} label={`Courses (${totalCourses})`} />
              </Tabs>
              {currentTab === 0 && (
                <Table>
                  <TableBody>
                    {courses.map((currentCourse) => {
                      return (
                        <TableRow key={currentCourse.id}>
                          <TableCell className={clsx(classes.cell)}>
                            <CourseItem course={currentCourse} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={totalCourses}
                        page={currentPage - 1}
                        onChangePage={(event, page) => {
                          setCurrentPage(page + 1);
                        }}
                        rowsPerPage={10}
                        rowsPerPageOptions={[10]}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              )}
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
  ));
};

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

const CoursePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  course_name: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(PropTypes.string)
});

CourseItem.propTypes = {
  course: CoursePropType
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
  courses: PropTypes.arrayOf(CoursePropType),
  total: PropTypes.number
};

export default withLayout(ProfilePage);
