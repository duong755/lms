import PropTypes from 'prop-types';
import Head from 'next/head';
import NextLink from 'next/link';
import fetch from 'isomorphic-unfetch';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

import withLayout from '../../../../../../../components/lib/withLayout';
import absURL from '../../../../../../../components/helpers/URL';

function LessonDetail(props) {
  const { user, course, lesson } = props;

  return (
    <>
      <Head>
        <title>{lesson.title}</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
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
          <Box py={3}>
            <div dangerouslySetInnerHTML={{ __html: lesson.content }}></div>
          </Box>
          <Divider color="initial" />
        </Container>
      </Box>
    </>
  );
}

LessonDetail.getInitialProps = async (context) => {
  const { userId, courseId, lessonId } = context.query;
  let user = {};
  let course = {};
  let lesson = {};

  try {
    const userResponse = await fetch(absURL(`/api/user/${userId}`), {
      method: 'GET',
      credentials: 'include'
    });
    const courseResponse = await fetch(absURL(`/api/user/${userId}/course/${courseId}`), {
      method: 'GET',
      credentials: 'include'
    });
    const lessonResponse = await fetch(absURL(`/api/user/${userId}/course/${courseId}/lesson/${lessonId}`), {
      method: 'GET',
      credentials: 'include'
    });
    user = await userResponse.json();
    course = await courseResponse.json();
    lesson = await lessonResponse.json();
    console.log(user, course, lesson);
  } catch (err) {
    console.error(err);
  }

  return {
    ...user,
    ...course,
    ...lesson
  };
};

LessonDetail.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['teacher', 'student']).isRequired
  }),
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    teacher_id: PropTypes.string.isRequired,
    course_name: PropTypes.string.isRequired,
    created_at: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
  }),
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.any
  })
};

export default withLayout(LessonDetail);
