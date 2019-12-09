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

import withLayout from '../../../../../../components/lib/withLayout';
import withCourse from '../../../../../../components/lib/withCourse';

const useStyles = makeStyles((theme) => ({
  exerciseContainer: {
    padding: theme.spacing(2)
  },
  exerciseLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none'
  }
}));

const mockExercises = [
  {
    title: 'Exercise 1',
    createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
  },
  {
    title: 'Exercise 2',
    createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
  },
  {
    title: 'Exercise 3',
    createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
  }
];

function ExerciseItem(props) {
  const classes = useStyles();

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
        <Typography>{props.createdAt}</Typography>
      </Paper>
    </Grid>
  );
}

function CourseExercise() {
  return (
    <>
      <Box py={2} />
      <Grid container spacing={2}>
        {mockExercises.map((currentExercise, currentExerciseIndex) => (
          <ExerciseItem key={currentExerciseIndex} {...currentExercise} />
        ))}
      </Grid>
    </>
  );
}

ExerciseItem.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string
};

export default withLayout(withCourse(CourseExercise, 'exercise'));
