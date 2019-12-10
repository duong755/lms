import PropTypes from 'prop-types';
import NextLink from 'next/link';
import clsx from 'clsx';
import fetch from 'isomorphic-unfetch';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

import withLayout from '../../../../../../components/lib/withLayout';
import withCourse from '../../../../../../components/lib/withCourse';
import AbsURL from '../../../../../../components/helpers/URL';

const useStyles = makeStyles((theme) => ({
  lessonContainer: {
    padding: theme.spacing(2)
  },
  lessonLink: {
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
// const mockLessons = [
//   {
//     title: 'Lesson 1',
//     createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
//   },
//   {
//     title: 'Lesson 2',
//     createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
//   },
//   {
//     title: 'Lesson 3',
//     createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
//   }
// ];

function LessonItem(props) {
  const classes = useStyles();
  const objDate = getDateObj(props.id);
  const createAt = dayjs(objDate).format('YYYY-MM-DD hh:mm A');
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
        <Typography>{createAt}</Typography>
      </Paper>
    </Grid>
  );
}

function CourseLesson(props) {
  return (
    <>
      <Box py={2} />
      <Grid container spacing={2}>
        {props.lessons.map((currentLesson) => (
          <LessonItem key={currentLesson.id} {...currentLesson} />
        ))}
      </Grid>
    </>
  );
}

LessonItem.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  id: PropTypes.string
};

CourseLesson.propTypes = {
  lessons: PropTypes.array
};

const CourseLessonPage = withCourse(CourseLesson, 'lesson');

CourseLesson.getInitialProps = async (context) => {
  const { userId, courseId } = context.query; // this contain userId, courseId, page
  const page = context.query.page === undefined ? '' : `?page=${Number(context.query.page)}`;
  /**
   * TODO:
   * - get lessons by pagination API
   */
  try {
    const response = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/lesson/${page}`), {
      method: 'GET'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
  return {
    userId: userId,
    courseId: courseId,
    page: Number(page) || 1
  };
};

export default withLayout(CourseLessonPage);
