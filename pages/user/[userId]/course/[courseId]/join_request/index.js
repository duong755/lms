import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import { isObject } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import Icon from '@material-ui/core/Icon';
import Link from '@material-ui/core/Link';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';

import withLayout from '../../../../../../components/hoc/withLayout';
import withCourseLayout from '../../../../../../components/hoc/withCourseLayout';
import AbsURL from '../../../../../../components/helpers/URL';
import AppUser from '../../../../../../components/auth/AppUser';
import { JoinRequestType, CourseType } from '../../../../../../components/propTypes';

const useStyles = makeStyles((theme) => ({
  joinRequestContainer: {
    padding: theme.spacing(2)
  },
  joinRequestLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none'
  },
  joinRequestTasks: {
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(1)
    }
  },
  cell: {
    padding: theme.spacing(2, 0)
  }
}));

function JoinRequestItem(props) {
  const classes = useStyles();
  const { joinRequest, handleAccept, handleDecline } = props;
  const userContext = useContext(AppUser);

  const isCourseOwner = useMemo(() => {
    if (isObject(userContext.user)) {
      return userContext.user.id === joinRequest.teacher_id;
    }
    return false;
  });

  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.joinRequestContainer)}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item xs={12} sm={6}>
            <NextLink href="/user/[userId]" as={`/user/${joinRequest.student_id}`} prefetch={false}>
              <Link href={`/user/${joinRequest.student_id}`} className={clsx(classes.joinRequestLink)}>
                <Typography title={joinRequest.username} color="primary" variant="h5">
                  {joinRequest.username}
                </Typography>
              </Link>
            </NextLink>
            <Box display="flex" alignItems="center">
              <Icon>access_time</Icon>
              &nbsp;
              <Typography variant="caption">
                Requested at{dayjs(joinRequest.request_at).format('YYYY MMM D hh:mm A')}
              </Typography>
            </Box>
          </Grid>
          {isCourseOwner && (
            <Grid item xs={12} sm={6}>
              <Box className={clsx(classes.joinRequestTasks)}>
                <Button variant="contained" color="primary" onClick={handleAccept}>
                  Accept
                </Button>
                &nbsp;
                <Button variant="outlined" color="primary" onClick={handleDecline}>
                  Decline
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
}

function CourseJoinRequest(props) {
  const router = useRouter();
  const { userId, courseId, joinRequestData, course, page } = props;
  const [currentPage, setCurrentPage] = useState(page);
  const [joinRequests, setJoinRequest] = useState(joinRequestData.joinRequests);
  const [total, setTotal] = useState(joinRequestData.total);
  const classes = useStyles();

  useEffect(() => {
    router.push(
      `/user/[userId]/course/[courseId]/join_request?page=${currentPage}`,
      `/user/${userId}/course/${courseId}/join_request?page=${currentPage}`
    );
  }, [currentPage]);

  useEffect(() => {
    setTotal(joinRequestData.total);
    setJoinRequest(joinRequestData.joinRequests);
  }, [joinRequestData]);

  const acceptJoinRequest = useCallback(async (event, joinRequest) => {
    event.preventDefault();
    try {
      const resFetch = await fetch(
        AbsURL(`/api/user/${userId}/course/${courseId}/join_request/${joinRequest.student_id}`),
        {
          method: 'POST',
          credentials: 'include',
          mode: 'same-origin'
        }
      );
      if (resFetch) {
        setJoinRequest((joinRequests) =>
          joinRequests.filter((current) => joinRequest.student_id !== current.student_id)
        );
        setTotal((total) => total--);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const declineJoinRequest = useCallback(async (event, joinRequest) => {
    event.preventDefault();
    try {
      const resFetch = await fetch(
        AbsURL(`/api/user/${userId}/course/${courseId}/join_request/${joinRequest.student_id}`),
        {
          method: 'DELETE',
          credentials: 'include',
          mode: 'same-origin'
        }
      );
      if (resFetch) {
        setJoinRequest((joinRequests) =>
          joinRequests.filter((current) => joinRequest.student_id !== current.student_id)
        );
        setTotal((total) => total--);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <Head>
        <title>{`${course.course_name} 's join request`}</title>
      </Head>
      <Box py={2} />
      {total ? (
        <Table>
          <TableBody>
            {joinRequests.map((current) => {
              return (
                <TableRow key={current.student_id}>
                  <TableCell className={clsx(classes.cell)}>
                    <JoinRequestItem
                      joinRequest={current}
                      handleAccept={(event) => acceptJoinRequest(event, current)}
                      handleDecline={(event) => declineJoinRequest(event, current)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {total > 10 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  page={page - 1}
                  onChangePage={(event, page) => setCurrentPage(page + 1)}
                  count={total}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      ) : (
        <Box textAlign="center">
          <Typography variant="h5">No join request available</Typography>
        </Box>
      )}
    </>
  );
}

JoinRequestItem.propTypes = {
  joinRequest: PropTypes.arrayOf(JoinRequestType).isRequired,
  handleAccept: PropTypes.func,
  handleDecline: PropTypes.func
};

CourseJoinRequest.propTypes = {
  joinRequestData: PropTypes.shape({
    joinRequests: PropTypes.arrayOf(JoinRequestType).isRequired,
    total: PropTypes.number.isRequired
  }).isRequired,
  userId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  course_name: PropTypes.string,
  course: CourseType.isRequired,
  page: PropTypes.number.isRequired
};

CourseJoinRequest.getInitialProps = async (context) => {
  const { userId, courseId } = context.query; // this contain userId, courseId, page
  const page = context.query.page === undefined ? 1 : Number(context.query.page) || 1;
  const data = { joinRequests: [], total: 0 };

  try {
    const response = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/join_request?page=${page}`), {
      method: 'GET',
      credentials: 'include'
    });
    const json = await response.json();
    if (response.ok) {
      Object.assign(data, json);
    }
  } catch (error) {
    console.log(error);
  }
  return {
    userId: userId,
    page: Number(context.query.page) || 1,
    courseId: courseId,
    joinRequestData: data
  };
};
export default withLayout(withCourseLayout(CourseJoinRequest, 'join_request'));
