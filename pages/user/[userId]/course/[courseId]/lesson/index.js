import { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { isObject } from 'lodash';
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
import NoSsr from '@material-ui/core/NoSsr';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import withLayout from '../../../../../../components/hoc/withLayout';
import withCourseLayout from '../../../../../../components/hoc/withCourseLayout';
import AbsURL from '../../../../../../components/helpers/URL';
import AppUser from '../../../../../../components/auth/AppUser';
import { LessonType, CourseType } from '../../../../../../components/propTypes';
import { getDateFromTimeUuid } from '../../../../../../components/helpers/timeuuid';

const useStyles = makeStyles((theme) => ({
  lessonContainer: {
    padding: theme.spacing(2)
  },
  lessonLink: {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'none'
    }
  },
  cell: {
    padding: theme.spacing(2, 0)
  }
}));

const LessonItem = (props) => {
  const { lesson } = props;
  const classes = useStyles();
  const createdAt = getDateFromTimeUuid(lesson.id);

  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.lessonContainer)}>
        <NextLink
          href="/user/[userId]/course/[courseId]/lesson/[lessonId]"
          as={`/user/${lesson.teacher_id}/course/${lesson.course_id}/lesson/${lesson.id}`}
          prefetch={false}
        >
          <Link
            href={`/user/${lesson.teacher_id}/course/${lesson.course_id}/lesson/${lesson.id}`}
            className={clsx(classes.lessonLink)}
          >
            <Typography title={lesson.title} color="primary" variant="h5">
              {lesson.title}
            </Typography>
          </Link>
        </NextLink>
        <Box display="flex" alignItems="center">
          <Icon>access_time</Icon>
          &nbsp;
          <Typography variant="caption">{dayjs(createdAt).format('YYYY MMM D hh:mm A')}</Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

const CourseLessonPage = (props) => {
  const { page, lessonData, userId, courseId, course } = props;
  const userContext = useContext(AppUser);
  const [currentPage, setCurrentPage] = useState(props.page);
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    router.push(
      `/user/[userId]/course/[courseId]/lesson?page=${currentPage}`,
      `/user/${userId}/course/${courseId}/lesson?page=${currentPage}`
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
        <title>{`${course.course_name}'s lessons`}</title>
      </Head>

      <NoSsr>
        {isCourseOwner && (
          <Grid container justify="flex-end">
            <NextLink
              href="/user/[userId]/course/[courseId]/lesson/create"
              as={`/user/${userId}/course/${courseId}/lesson/create`}
              prefetch={false}
            >
              <Button variant="contained" color="primary">
                <Icon>add</Icon>Create Lesson
              </Button>
            </NextLink>
          </Grid>
        )}
      </NoSsr>

      <Box py={2} />
      {lessonData.total ? (
        <Table>
          <TableBody>
            {lessonData.lessons.map((currentLesson) => {
              return (
                <TableRow key={currentLesson.id}>
                  <TableCell className={clsx(classes.cell)}>
                    <LessonItem lesson={currentLesson} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {lessonData.total >= 10 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  page={page - 1}
                  onChangePage={(event, page) => setCurrentPage(page + 1)}
                  count={lessonData.total}
                  rowsPerPage={10}
                  rowsPerPageOptions={[10]}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      ) : (
        <Box textAlign="center">
          <Typography variant="h4">No lesson available</Typography>
        </Box>
      )}
    </>
  );
};

LessonItem.propTypes = {
  lesson: LessonType
};

CourseLessonPage.propTypes = {
  courseId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  course: CourseType,
  page: PropTypes.number.isRequired,
  lessonData: PropTypes.shape({
    lessons: PropTypes.arrayOf(LessonType).isRequired,
    total: PropTypes.number.isRequired
  }).isRequired
};

CourseLessonPage.getInitialProps = async (context) => {
  const { userId, courseId } = context.query;
  const page = context.query.page === undefined ? 1 : Number(context.query.page) || 1;
  const data = { lessons: [], total: 0 };

  try {
    const response = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/lesson?page=${page}`), {
      method: 'GET'
    });
    const json = await response.json();
    if (response.ok) {
      Object.assign(data, json);
    }
  } catch (err) {
    console.error(err);
  }
  return {
    userId: userId,
    courseId: courseId,
    page: page,
    lessonData: data
  };
};

export default withLayout(withCourseLayout(CourseLessonPage, 'lesson'));
