/**
 * @typedef {'teacher' | 'student'} UserType
 * @typedef {{ id: string, email: string, username: string, type: UserType, info: Object<string, string> }} User
 * @typedef {{ id: string, teacher_id: string, course_name: string, created_at: string, archive?: boolean, description?: string, topics?: string | string[], members?: string | string[] }} Course
 * @typedef {{ currentUser?: User | null, total?: number | null, courses?: Course[] }} ProfilePageProps
 */
import { useState, useEffect, useMemo, useContext } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
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
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import withLayout from '../../../components/hoc/withLayout';
import absURL from '../../../components/helpers/URL';
import AppUser from '../../../components/auth/AppUser';
import { UserType, CourseType } from '../../../components/propTypes';
import CourseItem from '../../../components/CourseItem';

const useStyles = makeStyles((theme) => ({
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
 * @type {React.FunctionComponent<ProfilePageProps>}
 */
const ProfilePage = (props) => {
  const { currentUser } = props;
  const [currentTab, setCurrentTab] = useState(0);
  const [totalCourses, setTotalCourses] = useState(Number(props.total));
  const [courses, setCourses] = useState(props.courses);
  const [currentPage, setCurrentPage] = useState(1);
  const userContext = useContext(AppUser);
  const classes = useStyles();

  const totalPages = Math.ceil(totalCourses / 10);

  const matchUser = useMemo(() => {
    if (_.isObject(props.currentUser) && _.isObject(userContext.user)) {
      return props.currentUser.id === userContext.user.id;
    }
    return false;
  }, [props.currentUser, userContext.user]);

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
                  <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography variant="h5">
                      <strong>{currentUser.username}</strong>
                    </Typography>
                    &nbsp;&nbsp;
                    {matchUser && (
                      <NextLink href="/settings">
                        <Link href="/settings" color="inherit">
                          <em>Edit profile</em>
                        </Link>
                      </NextLink>
                    )}
                  </Box>
                  <Typography variant="caption">
                    {currentUser.type === 'teacher' && <Typography>Teacher</Typography>}
                    {currentUser.type === 'student' && <Typography>Student</Typography>}
                  </Typography>
                  <Box className={clsx(classes.otherInfo)}>
                    {otherInfo.map((currentPair) => {
                      if (currentPair[0] === '_update_') {
                        return null;
                      }
                      return (
                        <Typography key={currentPair[0]} variant="caption">{`${currentPair[0]}: ${
                          currentPair[1]
                        }`}</Typography>
                      );
                    })}
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
                  {totalPages > 1 && (
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
                  )}
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

CourseItem.propTypes = {
  course: CourseType
};

ProfilePage.propTypes = {
  currentUser: UserType,
  courses: PropTypes.arrayOf(CourseType),
  total: PropTypes.number
};

export default withLayout(ProfilePage);
