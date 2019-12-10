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
  lessonContainer: {
    padding: theme.spacing(2)
  },
  lessonLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none'
  }
}));

const mockLessons = [
  {
    title: 'Lesson 1',
    createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
  },
  {
    title: 'Lesson 2',
    createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
  },
  {
    title: 'Lesson 3',
    createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
  }
];

function LessonItem(props) {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.lessonContainer)}>
        <NextLink href="/" prefetch={false}>
          <Link href="/" className={clsx(classes.lessonLink)}>
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

function CourseLesson(props) {
  props;
  return (
    <>
      <Box py={2} />
      <Grid container spacing={2}>
        {mockLessons.map((currentLesson, currentLessonIndex) => (
          <LessonItem key={currentLessonIndex} {...currentLesson} />
        ))}
      </Grid>
    </>
  );
}

LessonItem.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string
};

const CourseLessonPage = withCourse(CourseLesson, 'lesson');

CourseLesson.getInitialProps = async (context) => {
  const { userId, courseId, page } = context.query; // this contain userId, courseId, page
  /**
   * TODO:
   * - get lessons by pagination API
   */
  return {
    userId: userId,
    courseId: courseId,
    page: Number(page) || 1
  };
};

export default withLayout(CourseLessonPage);
