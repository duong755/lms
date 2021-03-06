import PropTypes from 'prop-types';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import clsx from 'clsx';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import { useRouter } from 'next/router';
import { isObject } from 'lodash';
import { useState, useEffect, useMemo, useContext, useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Icon from '@material-ui/core/Icon';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import withLayout from '../../../../../../components/hoc/withLayout';
import withCourseLayout from '../../../../../../components/hoc/withCourseLayout';
import AbsURL from '../../../../../../components/helpers/URL';
import AppUser from '../../../../../../components/auth/AppUser';
import { MemberType, CourseType } from '../../../../../../components/propTypes';

const useStyles = makeStyles((theme) => ({
  memberContainer: {
    padding: theme.spacing(2)
  },
  memberLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none'
  },
  cell: {
    padding: theme.spacing(2, 0)
  }
}));

const MemberItem = (props) => {
  const classes = useStyles();
  const { member, onDelete } = props;
  const userContext = useContext(AppUser);

  const isCourseOwner = useMemo(() => {
    if (isObject(userContext.user)) {
      return userContext.user.id === member.teacher_id;
    }
  }, [userContext.user, member.teacher_id]);

  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.memberContainer)}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <NextLink href="/user/[userId]" as={`/user/${member.student_id}`} prefetch={false}>
              <Link href={`/user/${member.student_id}`} className={clsx(classes.memberLink)}>
                <Typography title={member.username} color="primary" variant="h5">
                  {member.username}
                </Typography>
              </Link>
            </NextLink>
            <Box display="flex" alignItems="center">
              <Icon>access_time</Icon>
              &nbsp;
              <Typography variant="caption">
                Member since {dayjs(member.joined_at).format('YYYY MMM D hh:mm A')}
              </Typography>
            </Box>
          </Grid>
          {isCourseOwner && (
            <Grid item>
              <IconButton onClick={onDelete}>
                <Icon>delete</Icon>
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
};

function CourseMember(props) {
  const { userId, courseId, memberData, course, page } = props;
  const classes = useStyles();
  const [currentPage, setPage] = useState(page);
  const [members, setMembers] = useState(memberData.members);
  const [total, setTotal] = useState(memberData.total);
  const router = useRouter();

  const handleDelete = useCallback(async (event, member) => {
    event.preventDefault();
    if (confirm(`Are you sure that you want to remove "${member.username}" from this course?`)) {
      setMembers((members) => members.filter((currentMember) => currentMember.student_id !== member.student_id));
      setTotal((total) => total--);
      try {
        const resFetch = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/member/${member.student_id}`), {
          method: 'DELETE',
          credentials: 'include',
          mode: 'same-origin'
        });
        const res = await resFetch.json();
        if (res.successful) {
          console.log('Delete successfully');
          return;
        } else {
          console.log(res);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    setTotal(memberData.total);
    setMembers(memberData.members);
  }, [memberData]);

  useEffect(() => {
    router.push(
      `/user/[userId]/course/[courseId]/member?page=${currentPage}`,
      `/user/${userId}/course/${courseId}/member?page=${currentPage}`
    );
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>{`${course.course_name}'s member`}</title>
      </Head>
      <Box py={2} />
      {total ? (
        <Table>
          <TableBody>
            {members.map((current) => {
              return (
                <TableRow key={current.student_id}>
                  <TableCell className={clsx(classes.cell)}>
                    <MemberItem member={current} onDelete={(event) => handleDelete(event, current)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {total >= 10 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  page={page - 1}
                  onChangePage={(event, page) => setPage(page + 1)}
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
          <Typography variant="h5">No member in this course</Typography>
        </Box>
      )}
    </>
  );
}

CourseMember.getInitialProps = async (context) => {
  const { userId, courseId } = context.query; // this contain userId, courseId, page
  const page = context.query.page === undefined ? '' : `?page=${Number(context.query.page)}`;
  const data = { members: [], total: 0 };

  try {
    const response = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/member${page}`), {
      method: 'GET'
    });
    const json = await response.json();
    if (response.ok) {
      Object.assign(data, json);
    }
  } catch (error) {
    console.log('error', error);
  }
  return {
    page: Number(context.query.page) || 1,
    userId: userId,
    courseId: courseId,
    memberData: data
  };
};

MemberItem.propTypes = {
  member: MemberType.isRequired,
  onDelete: PropTypes.func.isRequired
};

CourseMember.propTypes = {
  page: PropTypes.number.isRequired,
  memberData: PropTypes.shape({
    members: PropTypes.arrayOf(MemberType),
    total: PropTypes.number
  }),
  userId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  course: CourseType.isRequired,
  course_name: PropTypes.string
};

export default withLayout(withCourseLayout(CourseMember, 'member'));
