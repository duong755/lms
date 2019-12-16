import PropTypes from 'prop-types';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useContext, useState } from 'react';
import { isObject } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import NoSsr from '@material-ui/core/NoSsr';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import withLayout from '../../../../../../components/lib/withLayout';
import withCourse from '../../../../../../components/lib/withCourse';
import AbsURL from '../../../../../../components/helpers/URL';
import AppUser from '../../../../../../components/auth/AppUser';

const useStyles = makeStyles((theme) => ({
  exerciseContainer: {
    padding: theme.spacing(2)
  },
  exerciseLink: {
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

function ExerciseItem(props) {
  const classes = useStyles();
  const { exercise } = props;
  const createAt = getDateFromTimeUuid(exercise.id);
  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.exerciseContainer)}>
        <NextLink
          href="/user/[userId]/course/[courseId]/exercise/[exerciseid]"
          as={`/user/${exercise.teacher_id}/courseId/${exercise.course_id}/exercise/${exercise.id}`}
          prefetch={false}
        >
          <Link
            className={clsx(classes.exerciseLink)}
            href={`/user/${exercise.teacher_id}/course/${exercise.course_id}/exercise/${exercise.id}`}
          >
            <Typography title={exercise.title} color="primary" variant="h5">
              {exercise.title}
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

function CourseExercise(props) {
  const { page, exerciseData, userId, courseId, course } = props;
  const userContext = useContext(AppUser);
  const [currentPage, setCurrentPage] = useState(page);
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    router.push(
      `/user/[userId]/course/[courseId]/exercise/?page=${currentPage}`,
      `/user/${userId}/course/${courseId}/exercise/?page=${currentPage}`
    );
  }, [currentPage]);

  const isCourseOwner = useMemo(() => {
    if (isObject(userContext.user)) {
      return userContext.user.id === userId;
    }
    return false;
  }, [userContext.user, userId]);
  return (
    <>
      <Head>
        <title>{`${course.course_name} 's exercise`}</title>
      </Head>

      <NoSsr>
        {isCourseOwner && (
          <Grid container justify="flex-end">
            <NextLink
              href="/user/[userId]/course/[courseId]/exercise/create"
              as={`/user/${userId}/course/${courseId}/exam/create`}
            >
              <Button variant="contained" color="primary">
                <Icon>add</Icon>Create Exercise
              </Button>
            </NextLink>
          </Grid>
        )}
      </NoSsr>

      <Box py={2} />
      {exerciseData.total ? (
        <Table>
          <TableBody>
            {exerciseData.exercises.map((currentExercise) => {
              return (
                <TableRow key={currentExercise.id}>
                  <TableCell className={clsx(classes.cell)}>
                    <ExerciseItem exercise={currentExercise} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {exerciseData.total >= 10 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  page={page - 1}
                  onChangePage={(page) => setCurrentPage(page + 1)}
                  count={exerciseData.total}
                  rowsPerPage={10}
                  rowsPerPageOptions={10}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      ) : (
        <Box textAlign="center">
          <Typography variant="h4">No exercise available</Typography>
        </Box>
      )}
    </>
  );
}

CourseExercise.getInitialProps = async (context) => {
  const { userId, courseId } = context.query; // this contain userId, courseId, page
  const page = context.query.page === undefined ? '' : `?page=${Number(context.query.page)}`;
  let data = { exercises: [], total: 0 };

  try {
    const response = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/exercise/${page}`), {
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
    exerciseData: data
  };
};

export default withLayout(withCourse(CourseExercise, 'exercise'));

ExerciseItem.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  exercise: PropTypes.object.isRequired
};

CourseExercise.propTypes = {
  page: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  exerciseData: PropTypes.array.isRequired,
  course: PropTypes.object.isRequired
};
