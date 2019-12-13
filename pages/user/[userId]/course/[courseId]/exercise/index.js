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
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import withLayout from '../../../../../../components/lib/withLayout';
import withCourse from '../../../../../../components/lib/withCourse';
import AbsURL from '../../../../../../components/helpers/URL';

const useStyles = makeStyles((theme) => ({
  exerciseContainer: {
    padding: theme.spacing(2)
  },
  exerciseLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none'
  }
}));

function getTimeInt(uuid_str) {
  const uuid_arr = uuid_str.split('-'),
    time_str = [uuid_arr[2].substring(1), uuid_arr[1], uuid_arr[0]].join('');
  return parseInt(time_str, 16);
}

function getDateObj(uuid_str) {
  const int_time = getTimeInt(uuid_str) - 122192928000000000,
    int_millisec = Math.floor(int_time / 10000);
  return new Date(int_millisec);
}

// const mockExercises = [
//   {
//     title: 'Exercise 1',
//     createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
//   },
//   {
//     title: 'Exercise 2',
//     createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
//   },
//   {
//     title: 'Exercise 3',
//     createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
//   }
// ];

function ExerciseItem(props) {
  const classes = useStyles();
  const objDate = getDateObj(props.id);
  const createAt = dayjs(objDate).format('YYYY-MM-DD hh:mm A');
  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.exerciseContainer)}>
        <NextLink href="/" prefetch={false}>
          <Link href="/" className={clsx(classes.exerciseLink)}>
            <Typography title={props.title} color="primary" variant="h5">
              {props.title}
            </Typography>
          </Link>
        </NextLink>
        <Typography>{createAt}</Typography>
      </Paper>
    </Grid>
  );
}

function CourseExercise(props) {
  const { page, exerciseData, userId, courseId } = props;

  return (
    <>
      <Grid container justify="flex-end">
        <NextLink
          href="/user/[userId]/course/[courseId]/exercise/create"
          as={`/user/${userId}/course/${courseId}/exercise/create`}
        >
          <Button variant="contained" color="primary">
            <Icon>add</Icon>Create Exercise
          </Button>
        </NextLink>
      </Grid>
      <Box py={2} />
      <Grid container spacing={2}>
        {exerciseData.exercises.map((currentExercise) => (
          <ExerciseItem key={currentExercise.id} {...currentExercise} />
        ))}
      </Grid>
    </>
  );
}

ExerciseItem.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  id: PropTypes.string
};

CourseExercise.propTypes = {
  exercises: PropTypes.array
};

CourseExercise.getInitialProps = async (context) => {
  const { userId, courseId } = context.query; // this contain userId, courseId, page
  const page = context.query.page === undefined ? '' : `?page=${Number(context.query.page)}`;
  let data = { exercises: [], total: 0 };
  /**
   * TODO:
   * - get exercises by pagination API
   */
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
    page: Number(page) || 1,
    exerciseData: data
  };
};

export default withLayout(withCourse(CourseExercise, 'exercise'));
