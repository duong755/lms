/**
 * @typedef {{ id: string, email: string, username: string, type: 'teacher' | 'student', info: Object<string, string> }} User
 * @typedef {{ id: string, teacher_id: string, course_name: string, created_at: string, archive?: boolean, description?: string, topics?: string | string[], members?: string | string[] }} Course
 * @typedef {{ teacher_id: string, course_id: string, id: string, title: string, content: string, deadline: string }} Exercise
 */
import Head from 'next/head';
import NextLink from 'next/link';
import dayjs from 'dayjs';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import withLayout from '../../../../../../../components/lib/withLayout';
import withCourse from '../../../../../../../components/lib/withCourse';
import MuiRte from '../../../../../../../components/MuiRte';
import absURL from '../../../../../../../components/helpers/URL';
import { UserType, CourseType, ExerciseType } from '../../../../../../../components/propTypes';

/**
 * @type {React.FunctionComponent<{ user?: User, course?: Course, exercise?: Exercise }>}
 */
const Exercise = (props) => {
  const { user, course, exercise } = props;
  return ((
    <>
      <Head>
        <title>{exercise.title}</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item md={12} sm={12}>
              <Box pt={2}>
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
                    <strong>{exercise.title}</strong>
                  </Typography>
                </Breadcrumbs>
              </Box>
              <Box pt={4} pb={1}>
                <Typography title="Due-time" noWrap color="primary">
                  Due date: {dayjs(new Date(props.exercise.deadline)).format('YYYY MMM D, hh:mm')}
                </Typography>
              </Box>
              <Box mb={3}>
                <Paper>
                  <Box p={2}>
                    <div dangerouslySetInnerHTML={{ __html: exercise.content }}></div>
                  </Box>
                </Paper>
              </Box>
              <Divider />
              <Box mt={3}>
                <Paper>
                  <Box p={2}>
                    <Box pb={2}>
                      <Typography title="your-work" noWrap variant="h5">
                        <strong>Your work</strong>
                      </Typography>
                    </Box>
                    <MuiRte />
                    <Box pt={2}>
                      <Button variant="contained" color="primary">
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  ));
};

Exercise.getInitialProps = async (context) => {
  const { userId, courseId, exerciseId } = context.query;

  try {
    const response = await fetch(absURL(`/api/user/${userId}/course/${courseId}/exercise/${exerciseId}`));
    const data = await response.json();
    if (data.successful) {
      return data;
    } else {
      return;
    }
  } catch (error) {
    console.error(error);
  }
};

Exercise.propTypes = {
  user: UserType,
  course: CourseType,
  exercise: ExerciseType
};

export default withLayout(withCourse(Exercise));
