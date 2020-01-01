/**
 * @typedef {{ teacher_id: string, course_id: string, id: string, title: string, content: string }} Lesson
 */
import { useContext, useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { isObject } from 'lodash';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import NoSsr from '@material-ui/core/NoSsr';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import withLayout from '../../../../../../../components/hoc/withLayout';
import withCourse from '../../../../../../../components/hoc/withCourse';
import NotFound from '../../../../../../../components/NotFound';
import absURL from '../../../../../../../components/helpers/URL';
import AppUser from '../../../../../../../components/auth/AppUser';
import { UserType, CourseType, LessonType } from '../../../../../../../components/propTypes';
import LessonTasks from '../../../../../../../components/lesson/LessonTasks';

/**
 * @type {React.FunctionComponent<{ lesson?: Lesson, user?: User, course?: import('../../../../../../../components/NotFound').Course }>}
 */
const LessonDetail = (props) => {
  const { user, course, lesson } = props;
  const userContext = useContext(AppUser);

  const isCourseCreator = useMemo(() => {
    if (isObject(userContext.user)) {
      if (user) {
        if (userContext.user.id === user.id) {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  }, [userContext.user]);

  return ((
    <>
      <Head>
        <title>{lesson ? lesson.title : 'Lesson Not Found'}</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          {user && course && lesson ? (
            <>
              <Box py={3}>
                <Breadcrumbs separator="/" aria-label="breadcrumb">
                  <NextLink href="/user/[userId]" as={`/user/${user.id}`} prefetch={false}>
                    <Link color="textPrimary" href={`/user/${user.id}`}>
                      <Typography variant="h5">{user.username}</Typography>
                    </Link>
                  </NextLink>
                  <NextLink
                    href="/user/[userId]/course/[courseId]"
                    as={`/user/${user.id}/course/${course.id}`}
                    prefetch={false}
                  >
                    <Link color="textPrimary" href={`/user/${user.id}/course/${course.id}`}>
                      <Typography variant="h5">
                        <strong>{course.course_name}</strong>
                      </Typography>
                    </Link>
                  </NextLink>
                  <Typography variant="h5" color="textPrimary">
                    <strong>{lesson.title}</strong>
                  </Typography>
                </Breadcrumbs>
              </Box>

              <NoSsr>{isCourseCreator && <LessonTasks lesson={lesson} />}</NoSsr>

              <Paper>
                <Box px={2} py={3}>
                  <div id="lessonContent" dangerouslySetInnerHTML={{ __html: lesson.content }}></div>
                </Box>
              </Paper>
              <Divider color="initial" />
            </>
          ) : (
            <Box py={3} textAlign="center">
              <NotFound user={user} course={course} lesson={lesson} item="lesson" />
            </Box>
          )}
          <Box py={2} />
          {/* <CommentEditor /> */}
          <Box py={2} />
        </Container>
      </Box>
    </>
  ));
};

LessonDetail.getInitialProps = async (context) => {
  const { userId, courseId, lessonId } = context.query;
  let lesson = {};

  try {
    const lessonResponse = await fetch(absURL(`/api/user/${userId}/course/${courseId}/lesson/${lessonId}`), {
      method: 'GET',
      credentials: 'include'
    });
    if (lessonResponse.ok) {
      lesson = await lessonResponse.json();
    }
  } catch (err) {
    console.error(err);
  }

  return {
    ...lesson
  };
};

LessonDetail.propTypes = {
  user: UserType,
  course: CourseType,
  lesson: LessonType
};

export default withLayout(withCourse(LessonDetail));
