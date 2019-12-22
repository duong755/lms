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

import withLayout from '../../../../../../components/hoc/withLayout';
import withCourseLayout from '../../../../../../components/hoc/withCourseLayout';
import AbsURL from '../../../../../../components/helpers/URL';
import AppUser from '../../../../../../components/auth/AppUser';
import { ExerciseType, CourseType } from '../../../../../../components/propTypes';
import { getDateFromTimeUuid } from '../../../../../../components/helpers/timeuuid';

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

const ExerciseItem = (props) => {
  const classes = useStyles();
  const { exercise } = props;
  const createAt = getDateFromTimeUuid(exercise.id);
  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.exerciseContainer)}>
        <NextLink
          href="/user/[userId]/course/[courseId]/exercise/[exerciseId]"
          as={`/user/${exercise.teacher_id}/course/${exercise.course_id}/exercise/${exercise.id}`}
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
        <Grid container>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <Icon>access_time</Icon>
              &nbsp;
              <Typography variant="caption">Posted at {dayjs(createAt).format('YYYY MMM D hh:mm A')}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <Icon>timer</Icon>
              &nbsp;
              <Typography variant="caption">
                Due time: {dayjs(exercise.deadline).format('YYYY MMM D hh:mm A')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

const CourseExercise = (props) => {
  const { page, exerciseData, userId, courseId, course } = props;
  const userContext = useContext(AppUser);
  const [currentPage, setCurrentPage] = useState(page);
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    router.push(
      `/user/[userId]/course/[courseId]/exercise?page=${currentPage}`,
      `/user/${userId}/course/${courseId}/exercise?page=${currentPage}`
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
        <title>{`${course.course_name} 's exercises`}</title>
      </Head>

      <NoSsr>
        {isCourseOwner && (
          <Grid container justify="flex-end">
            <NextLink
              href="/user/[userId]/course/[courseId]/exercise/create"
              as={`/user/${userId}/course/${courseId}/exercise/create`}
              prefetch={false}
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
                  onChangePage={(event, page) => setCurrentPage(page + 1)}
                  count={exerciseData.total}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
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
};

ExerciseItem.propTypes = {
  exercise: ExerciseType
};

CourseExercise.propTypes = {
  page: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  exerciseData: PropTypes.shape({
    total: PropTypes.number.isRequired,
    exercises: PropTypes.arrayOf(ExerciseType)
  }),
  course: CourseType.isRequired
};

CourseExercise.getInitialProps = async (context) => {
  const { userId, courseId } = context.query;
  const page = context.query.page === undefined ? 1 : Number(context.query.page) || 1;
  const data = { exercises: [], total: 0 };

  try {
    const response = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/exercise?page=${page}`), {
      method: 'GET'
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
    courseId: courseId,
    page: page,
    exerciseData: data
  };
};

export default withLayout(withCourseLayout(CourseExercise, 'exercise'));
