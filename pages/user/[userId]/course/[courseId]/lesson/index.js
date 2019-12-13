import { useCallback } from 'react';
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
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

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
  },
  pageContainer: {
    listStyleType: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pageLink: {
    padding: theme.spacing(1.5),
    fontSize: theme.typography.fontSize,
    color: theme.palette.text.primary
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

function LessonItem(props) {
  const { userId, courseId, id: lessonId } = props;
  const classes = useStyles();
  const objDate = getDateObj(props.id);
  const createAt = dayjs(objDate).format('YYYY-MM-DD hh:mm A');

  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.lessonContainer)}>
        <NextLink
          href="/user/[userId]/course/[courseId]/lesson/[lessonId]"
          as={`/user/${userId}/course/${courseId}/lesson/${lessonId}`}
          prefetch={false}
        >
          <Link href={`/user/${userId}/course/${courseId}/lesson/${lessonId}`} className={clsx(classes.lessonLink)}>
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
  const { page, lessonData, userId, courseId } = props;
  const pages = Math.ceil(lessonData.total / 10);

  /**
   * @type {(page: number) => string}
   */
  const url = useCallback((page) => `/user/[userId]/course/[courseId]/lesson?page=${page}`, []);
  /**
   * @type {(page: number) => string}
   */
  const as = useCallback((page) => `/user/${userId}/course/${courseId}/lesson?page=${page}`, []);

  return (
    <>
      <Grid container justify="flex-end">
        <NextLink
          href="/user/[userId]/course/[courseId]/lesson/create"
          as={`/user/${userId}/course/${courseId}/lesson/create`}
        >
          <Button variant="contained" color="primary">
            <Icon>add</Icon>Create Lesson
          </Button>
        </NextLink>
      </Grid>

      <Box py={2} />
      {lessonData.total ? (
        <Grid container spacing={2}>
          {lessonData.lessons.map((currentLesson) => (
            <LessonItem key={currentLesson.id} {...currentLesson} courseId={courseId} userId={userId} />
          ))}
          <Grid item xs={12}>
            <NextLink href={url(page - 1)} as={as(page - 1)}>
              <Button color="primary" variant="outlined" href={as(page - 1)} disabled={page <= 1} size="small">
                Previous
              </Button>
            </NextLink>
            <NextLink href={url(page + 1)} as={as(page + 1)}>
              <Button color="primary" variant="outlined" href={as(page + 1)} disabled={page >= pages} size="small">
                Next
              </Button>
            </NextLink>
          </Grid>
        </Grid>
      ) : (
        <Box textAlign="center">
          <Typography variant="h4">No lesson available</Typography>
        </Box>
      )}
    </>
  );
}

LessonItem.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  id: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};

CourseLesson.propTypes = {
  courseId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  lessonData: PropTypes.shape({
    lessons: PropTypes.arrayOf(PropTypes.object).isRequired,
    total: PropTypes.number.isRequired
  }).isRequired
};

CourseLesson.getInitialProps = async (context) => {
  const { userId, courseId } = context.query;
  const page = context.query.page === undefined ? '' : `?page=${Number(context.query.page)}`;
  let data = { lessons: [], total: 0 };

  try {
    const response = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/lesson/${page}`), {
      method: 'GET'
    });
    data = await response.json();
  } catch (err) {
    console.error(err);
  }
  return {
    userId: userId,
    courseId: courseId,
    page: Number(context.query.page) || 1,
    lessonData: data
  };
};

const CourseLessonPage = withCourse(CourseLesson, 'lesson');

export default withLayout(CourseLessonPage);
