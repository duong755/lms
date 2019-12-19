import { useContext, useEffect, useMemo, useState } from 'react';
import { isObject } from 'lodash';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import NoSsr from '@material-ui/core/NoSsr';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import AbsURL from '../../../../../../components/helpers/URL';
import withLayout from '../../../../../../components/lib/withLayout';
import withCourse from '../../../../../../components/lib/withCourse';
import AppUser from '../../../../../../components/auth/AppUser';

const useStyles = makeStyles((theme) => ({
  examContainer: {
    padding: theme.spacing(2)
  },
  examLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none'
  },
  cell: {
    padding: theme.spacing(2, 0)
  }
}));

const getTimeInt = function(uuidStr) {
  const uuidArr = uuidStr.split('-'),
    timeStr = [uuidArr[2].substring(1), uuidArr[1], uuidArr[0]].join('');
  return parseInt(timeStr, 16);
};

const getDateFromTimeUuid = function(uuidStr) {
  const intTime = getTimeInt(uuidStr) - 122192928000000000,
    intMillisec = Math.floor(intTime / 10000);
  return new Date(intMillisec);
};

function ExamItem(props) {
  const classes = useStyles();
  const { exam } = props;
  const createAt = getDateFromTimeUuid(exam.id);
  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.examContainer)}>
        <NextLink
          href="/user/[userId]/course/[courseId]/exam/[examId]"
          as={`/user/${exam.userId}/course/[courseId]/exam/${exam.id}`}
          prefetch={false}
        >
          <Link
            href={`/user/${exam.userId}/course/${exam.courseId}/exam/${exam.examId}`}
            className={clsx(classes.examLink)}
          >
            <Typography title={exam.title} color="primary" variant="h5">
              {exam.title}
            </Typography>
          </Link>
        </NextLink>
        <Box display="flex" alignItems="center">
          <Icon>access_time</Icon>
          &nbsp;
          <Typography variant="caption">{dayjs(createAt).format('YYYY MMM D hh:mm A')}</Typography>
        </Box>
      </Paper>
    </Grid>
  );
}

function CourseExam(props) {
  const { userId, courseId, page, course, examData } = props;
  const userContext = useContext(AppUser);
  const classes = useStyles();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    router.push(
      `/user/[userId]/course/[courseId]/exam/?page=${currentPage}`,
      `/user/${userId}/course/${courseId}/exam/?page=${currentPage}`
    );
  }, [currentPage]);

  const isCourseOwner = useMemo(() => {
    if (isObject(userContext.user)) {
      return userContext.user.id === userId;
    }
  }, [userContext.user, userId]);

  return (
    <>
      <Head>
        <title>{`${course.course_name} 's exam`}</title>
      </Head>

      <NoSsr>
        {isCourseOwner && (
          <Grid container justify="flex-end">
            <NextLink
              href="/user/[userId]/course/[courseId]/exam/create"
              as={`/user/${userId}/course/${courseId}/exam/create`}
            >
              <Button variant="contained" color="primary">
                <Icon>add</Icon>Create Exam
              </Button>
            </NextLink>
          </Grid>
        )}
      </NoSsr>

      <Box py={2} />
      {examData.total ? (
        <Table>
          <TableBody>
            {examData.exams.map((currentExam) => {
              return (
                <TableRow key={currentExam.id}>
                  <TableCell className={clsx(classes.cell)}>
                    <ExamItem exam={currentExam} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {examData.total >= 10 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  page={page - 1}
                  onChangePage={(page) => setCurrentPage(page + 1)}
                  count={examData.total}
                  rowsPerPage={10}
                  rowsPerPageOptions={10}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      ) : (
        <Box textAlign="center">
          <Typography variant="h5">No exam available</Typography>
        </Box>
      )}
    </>
  );
}

ExamItem.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  id: PropTypes.string
};

CourseExam.propTypes = {
  exams: PropTypes.array
};

CourseExam.getInitialProps = async (context) => {
  const { userId, courseId } = context.query; // this contain userId, courseId, page
  const page = context.query.page === undefined ? 1 : Number(context.query.page) || 1;
  let data = { exams: [], total: 0 };

  try {
    const response = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/exam?page=${page}`), {
      method: 'GET'
    });
    data = await response.json();
  } catch (error) {
    console.log(error);
  }
  return {
    userId: userId,
    courseId: courseId,
    page: Number(context.query.page) || 1,
    examData: data
  };
};

ExamItem.propTypes = {
  exam: PropTypes.object.isRequired
};

CourseExam.propTypes = {
  userId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  examData: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  course_name: PropTypes.string.isRequired,
  course: PropTypes.object.isRequired
};
export default withLayout(withCourse(CourseExam, 'exam'));
